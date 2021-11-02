import * as fs from 'fs'
import * as path from 'path'
import {promisify } from 'util'
import {$ } from 'zx'
import { exit } from 'process'

import { chooseFile, loadOSTS, askForPreferences, savePreferences, SPOFile } from './osts-utils'

const fswriteFile = promisify(fs.writeFile)
const fsmkdir = promisify(fs.mkdir)


async function extractBody(file:SPOFile) {

    const osts = await loadOSTS( file.Name )

    //const srcFilePath = path.join('src', `${path.basename(file.Name, '.osts')}_${osts.version}.ts`)
    await fsmkdir( path.dirname(osts.bodyFilePath) )
    await fswriteFile( osts.bodyFilePath, osts.body )
}

async function unpack() {

    const prefs = await askForPreferences()   
    if( !prefs ) return

    try {

        $.verbose = false
        
        const JMESPathQuery = `[?ends_with(Name, '.osts')]`
        const result = await $`m365 spo file list --webUrl ${prefs.weburl} --folder ${prefs.folder} --recursive --query ${JMESPathQuery}`

        const spoFileListResult = JSON.parse( result.stdout ) as Array<SPOFile>

        if( !spoFileListResult.length || spoFileListResult.length === 0 ) {
            console.error( `no OSTS files detected at folder '${prefs.folder}` )
            exit(-1)
        }

        const selectedFile = await chooseFile(spoFileListResult, (file) => file.Name )
        if( !selectedFile ) {
            exit(-1)
        }

        // $.verbose = true

        await $`m365 spo file get --webUrl ${prefs.weburl} --id ${selectedFile.UniqueId} --asFile --path ${selectedFile.Name}`

        await extractBody( selectedFile )

        savePreferences( prefs )
    }
    catch( e ) {
        console.error( 'error searching file', e)
        exit(-1)
    }

    exit(1)
}


(async() => unpack() )()