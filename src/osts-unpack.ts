import 'zx/globals'
import * as fs from 'fs'
import * as path from 'path'
import {promisify } from 'util'

import { 
    chooseFile, 
    loadOSTS, 
    askForPreferences, 
    savePreferences, 
    SPOFile, 
    copyOfficeScriptSimplifiedDeclaration as CP_D_TS, 
    listOfficeScript} from './osts-utils.js'

export interface Options {
    copyOfficeScriptSimplifiedDeclaration?:boolean
    
} 

const fsWriteFile = promisify(fs.writeFile)
const fsMkdir = promisify(fs.mkdir)

async function extractBody(file:SPOFile, bodyDirPath:string) {

    const osts = await loadOSTS( file.Name, bodyDirPath )
    //console.log( 'bodyDirPath', bodyDirPath, 'bodyFilePath', osts.bodyFilePath )
    
    const dir = path.dirname(osts.bodyFilePath)
    if( !fs.existsSync(dir) ) {
        await fsMkdir( dir )
    } 
    await fsWriteFile( osts.bodyFilePath, osts.body )
}

export async function unpack( bodyDirPath:string, copyOfficeScriptSimplifiedDeclaration?:boolean ) {

    const prefs = await askForPreferences()   
    if( !prefs ) return 0

    try {

        $.verbose = false
        
        const spoFileListResult = await listOfficeScript( prefs )

        if( !spoFileListResult.length || spoFileListResult.length === 0 ) {
            console.error( `no OSTS files detected at folder '${prefs.folder}` )
            return -1
        }

        const selectedFile = await chooseFile(spoFileListResult, (file) => file.Name )
        if( !selectedFile ) {
            return -1
        }

        // $.verbose = true

        await $`m365 spo file get --webUrl ${prefs.weburl} --id ${selectedFile.UniqueId} --asFile --path ${selectedFile.Name}`

        await extractBody( selectedFile, bodyDirPath )

        if( copyOfficeScriptSimplifiedDeclaration ) {

            await CP_D_TS( bodyDirPath )
        }

        savePreferences( prefs )
    }
    catch( e ) {
        console.error( 'error searching file', e)
        return -1
    }

    return 0
}
