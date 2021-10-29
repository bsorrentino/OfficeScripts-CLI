import * as fs from 'fs'
import * as path from 'path'
import {promisify } from 'util'
import {$, question } from 'zx'
import Preferences from 'preferences'
import { exit } from 'process'

interface OSTS {
    "version": string,
    "body": string
    "description": string,
    "parameterInfo": string
    "apiInfo": string

}

interface PreferenceData {
    weburl:string,
    folder:string
}

interface SPOFile {
    Name: string,
    ServerRelativeUrl: string,
    UniqueId:string
}

const fsreadFile = promisify(fs.readFile)
const fswriteFile = promisify(fs.writeFile)


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


const chooseFile = async (files:Array<SPOFile>) => {

    const choice = async () => ( files.length === 1 ) ?
        await question( `choose file, default 1: `) :
        await question( `choose file [1-${files.length}], default 1: ` )
    
    try {

        const answer = (await choice()).trim() 

        if( answer.length === 0 ) {
            return 1
        }

        const index = Number(answer)

        if( index >=1 && index < files.length ) {
            return index
        }

        console.error( `invalid range`)
    }
    catch( e ) {
        console.error( `invalid number`)
    }
   
}

async function extractBody(file:SPOFile) {

    const content = await fsreadFile( file.Name )

    const osts = JSON.parse( content.toString() ) as OSTS
    const srcFilePath = path.join('src', `${path.basename(file.Name, '.osts')}_${osts.version}.ts`)
    
    await fswriteFile( srcFilePath, osts.body )
}

async function main() {

    const prefs = new Preferences('org.bsc.officescripts-cli',{}, {
        encrypt: false
    }) as Partial<PreferenceData>;
      
    const candidateWebUrl = await askForWebUrl( prefs )
    if( !candidateWebUrl ) return
    const candidateFolder = await askForFolder( prefs )
    if( !candidateFolder ) return

    try {

        $.verbose = false
        
        const JMESPathQuery = `[?ends_with(Name, '.osts')]`
        const result = await $`m365 spo file list --webUrl ${candidateWebUrl} --folder ${candidateFolder} --recursive --query ${JMESPathQuery}`

        const spoFileListResult = JSON.parse( result.stdout ) as Array<SPOFile>

        if( !spoFileListResult.length || spoFileListResult.length === 0 ) {
            console.error( `no OSTS files detected at folder '${candidateFolder}` )
            exit(-1)
        }

        spoFileListResult.forEach( (file:SPOFile, index:number ) => 
            console.log( `${index+1}) - ${file.Name}`))    

        const index = await chooseFile(spoFileListResult)
        if( !index ) {
            exit(-1)
        }

        // $.verbose = true

        const selectedFile = spoFileListResult[index-1]

        await $`m365 spo file get --webUrl ${candidateWebUrl} --id ${selectedFile.UniqueId} --asFile --path ${selectedFile.Name}`

        await extractBody( selectedFile )

        prefs.folder = candidateFolder
        prefs.weburl = candidateWebUrl
    }
    catch( e ) {
        console.error( 'error searching file')
        exit(-1)
    }

    exit(1)
}


(async() => main() )()