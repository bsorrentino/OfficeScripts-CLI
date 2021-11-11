import * as fs from 'fs'
import * as path from 'path'
import {promisify } from 'util'
import {$ } from 'zx'

import { chooseFile, loadOSTS, askForPreferences, savePreferences, SPOFile } from './osts-utils'

const fswriteFile = promisify(fs.writeFile)
const fsmkdir = promisify(fs.mkdir)


async function extractBody(file:SPOFile, bodyDirPath:string) {

    const osts = await loadOSTS( file.Name, bodyDirPath )

    //const srcFilePath = path.join('src', `${path.basename(file.Name, '.osts')}_${osts.version}.ts`)
    const dir = path.dirname(osts.bodyFilePath)
    if( !fs.existsSync(dir) ) {
        await fsmkdir( dir )
    } 
    await fswriteFile( osts.bodyFilePath, osts.body )
}

export async function unpack( bodyDirPath:string ) {

    const prefs = await askForPreferences()   
    if( !prefs ) return 0

    try {

        $.verbose = false
        
        const JMESPathQuery = `[?ends_with(Name, '.osts')]`
        const result = await $`m365 spo file list --webUrl ${prefs.weburl} --folder ${prefs.folder} --recursive --query ${JMESPathQuery}`

        const spoFileListResult = JSON.parse( result.stdout ) as Array<SPOFile>

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

        savePreferences( prefs )
    }
    catch( e ) {
        console.error( 'error searching file', e)
        return -1
    }

    return 0
}
