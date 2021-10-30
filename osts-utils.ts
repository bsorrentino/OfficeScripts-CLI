import { question } from "zx"
import * as fs from 'fs'
import * as path from 'path'
import {promisify } from 'util'

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
}

export interface SPOFile {
    Name: string,
    ServerRelativeUrl: string,
    UniqueId:string
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

        if( index >=1 && index < files.length ) {
            return files[index-1]
        }

        console.error( `invalid range`)
    }
    catch( e ) {
        console.error( `invalid number`)
    }
   
}

const fsreadFile = promisify(fs.readFile)

export async function loadOSTS( filePath:string ):Promise<LoadedOSTS> {

    const content = await fsreadFile( filePath )

    const osts = JSON.parse( content.toString() ) as OSTS

    const bodyFilePath = path.join('src', `${path.basename(filePath, '.osts')}_${osts.version}.ts`)
    
    return { bodyFilePath: bodyFilePath, ...osts}

}
    
