import 'zx/globals'
import * as fs from 'fs'
import * as path from 'path'
import {promisify } from 'util'
import Preferences from "preferences"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface OSTS {
    "version": string
    "body": string
    "description": string
    "parameterInfo": string
    "apiInfo": string

}

export type LoadedOSTS = OSTS & { bodyFilePath:string }

export interface PreferenceData {
    weburl:string,
    folder:string
    toPath:() => string
}

export interface SPOFile {
    Name: string
    ServerRelativeUrl: string
    UniqueId:string
    Length:number
    Level:number
    Exists:boolean
    MajorVersion:number
    MinorVersion:number
    TimeCreated:Date
    TimeLastModified:Date
}

const askForWebUrl = async (prefs:Partial<PreferenceData>) => {
    const ask = async () => ( prefs.weburl ) ?
        await question( `Web Url, default '${prefs.weburl}' type url or <enter> to confirm: `) :
        await question( `Web Url, type an valid url: `)
    
    // console.log( 'answer', answer )
    
    const isValid = ( url:string ) => url.trim().length > 0

    const answer = (await ask()).trim()
    if( answer.length === 0 && prefs.folder ) {
        return prefs.weburl
    }
    if( isValid(answer) ) {
        return answer
    }
   
    console.error(`provided answer '${answer}' is not valid!`)
   
}

const askForFolder = async (prefs:Partial<PreferenceData>) => {
    const ask = async () => ( prefs.folder ) ?
        await question( `Folder, default '${prefs.folder}' type url or <enter> to confirm: `) :
        await question( `Folder, type an valid folder path: `)
    
    // console.log( 'answer', answer )

    const isValid = ( url:string ) => url.trim().length > 0

    const answer = (await ask()).trim()
    if( answer.length === 0 && prefs.folder ) {
        return prefs.folder
    }
    if( isValid(answer) ) {
        return answer
    }
   
    console.error(`provided answer '${answer}' is not valid!`)
   
}

const _prefs = new Preferences('org.bsc.officescripts-cli',{}, {
    encrypt: false
}) as Partial<PreferenceData>

export const askForPreferences = async ():Promise<PreferenceData|undefined> => {

    // const candidateWebUrl = await askForWebUrl( _prefs )
    // if( !candidateWebUrl ) return
    // const candidateFolder = await askForFolder( _prefs )
    // if( !candidateFolder ) return

    const candidateWebUrl = await getWebUrl()
    const candidateFolder = path.join( 'Documents', 'Documents', 'Office Scripts')

    return { 
        weburl:candidateWebUrl, 
        folder:candidateFolder, 
        toPath: () => path.join( new URL( candidateWebUrl ).pathname, candidateFolder) 
    }
}

export const savePreferences = ( data:PreferenceData) => {

    // _prefs.weburl = data.weburl
    // _prefs.folder = data.folder

}

export const chooseFile = async <T>(files:Array<T>, print:(file:T) => string ) => {

    files.forEach( (file:T, index:number ) => 
            console.log( `${index+1}) ${print(file)}`))    

    const choice = async () => ( files.length === 1 ) ?
        await question( `choose file, default 1: `) :
        await question( `choose file [1-${files.length}], default 1: ` )
    
    try {

        const answer = (await choice()).trim() 

        if( answer.length === 0 ) {
            return files[0]
        }

        const index = Number(answer)

        if( index >=1 && index <= files.length ) {
            return files[index-1]
        }

        console.error( `invalid range`)
    }
    catch( e ) {
        console.error( `invalid number`)
    }
   
}

const fsreadFile = promisify(fs.readFile)

export async function loadOSTS( filePath:string, bodyDirPath:string ):Promise<LoadedOSTS> {

    const content = await fsreadFile( filePath )

    const osts = JSON.parse( content.toString() ) as OSTS

    const bodyFilePath = path.join(bodyDirPath, `${path.basename(filePath, '.osts')}_${osts.version}.ts`)
    
    // console.log( 'loadOSTS.bodyFilePath',  bodyFilePath, osts  )
    
    return { ...osts, bodyFilePath: bodyFilePath}

}
    
const DECLARATION_FILES = [ 'excel.d.ts', 'global.d.ts' ] 

const fsCopyFile = promisify(fs.copyFile)

export async function copyOfficeScriptSimplifiedDeclaration( bodyDirPath:string ) {

    try {
         //console.debug( '__dirname', __dirname )
         await fsCopyFile( path.join(__dirname, '..', DECLARATION_FILES[0]), path.join(bodyDirPath,DECLARATION_FILES[0]) )
         await fsCopyFile( path.join(__dirname, '..', DECLARATION_FILES[1]), path.join(bodyDirPath,DECLARATION_FILES[1]) )
        //  console.info( `declaration file needs installation of '${chalk.yellow('@types/Office.js')}' running ${chalk.inverse('npm install -D @types/office-js')}`)

         return 0
     }
     catch( e ) {
         console.error( 'failed to copy declaration files', e )
         return -1
     }
 }


 export async function listOfficeScript( prefs: PreferenceData ): Promise<Array<SPOFile>> {

    const list_parameters = [
        '--webUrl', prefs.weburl,
        '--folderUrl', prefs.folder,
        '--query', "[?ends_with(Name, '.osts')]",
        '--recursive'
    ]
    
    const result =  await $`m365 spo file list ${list_parameters}`.quiet()
    
    const spoFileListResult = JSON.parse( result.stdout ) as Array<SPOFile>

    return spoFileListResult
 } 

interface Connected {
    connectedAs: string
}

type Status = Connected | "Logged out"

export const getWebUrl = async () => {

    const cmd_status = await $`m365 status`.quiet()

    const status = JSON.parse(cmd_status.stdout) as Status  

    if( typeof(status)==='string' ) {
        throw  "User not connected!"
    }

    const args = [
        '--query', `[?Owner=='${status.connectedAs}'].Url | [0]`
    ]
    
    try {
        const cmd_list = await $`m365 onedrive list ${args}`.quiet()

        const url = JSON.parse(cmd_list.stdout) 
    
        if( url === null ) {
            throw  `Owner '${status.connectedAs}' not found!`
        }
    
        return url
    
    }
    catch( e ) {
        
        const tenant = await question( `give me tenant name: `) 

        const url = `https://${tenant}-my.sharepoint.com/personal/${status.connectedAs.replace(/[.@]/g, '_')}`

        // console.debug( 'url', url)
        return url
    }
}