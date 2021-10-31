import * as fs from 'fs'
import * as path from 'path'
import { exit } from 'process'
import {promisify } from 'util'
import {$, question } from 'zx'

import { askForPreferences, chooseFile, loadOSTS, savePreferences } from './osts-utils'

const fsreadFile = promisify(fs.readFile)
const fswriteFile = promisify(fs.writeFile)
const fsreaddir = promisify(fs.readdir)

const askForConfirmUpload = async () => {
    const answer = (await question( 'do you want upload file? (Y/n): '))
                        .trim()
                        .toLowerCase()

    if( answer.length === 0 || answer === 'y' ) return true
     
    return false
}

async function pack() {

    const osts_files = (await fsreaddir( '.' ))
        .filter( n => path.extname(n)==='.osts')
        
    const selectedFile = await chooseFile(osts_files, (file) => file )
    if( !selectedFile ) {
        return -1
    }

    const osts = await loadOSTS( selectedFile )

    const body_source = await fsreadFile( osts.bodyFilePath )

    osts.body = body_source.toString()

    await fswriteFile( selectedFile, JSON.stringify(osts) )

    const upload = await askForConfirmUpload()

    if( !upload ) return 1

    const prefs = await askForPreferences()   
    if( !prefs ) return 1

    await $`m365 spo file add  --webUrl ${prefs.weburl} --folder ${prefs.folder} --path ${selectedFile}`

    savePreferences( prefs )

}


(async() => { 
    try {
        const code = await pack()
        exit(code)
     }
     catch( e ) {
         console.error( 'error occurred!', e)
         exit(-1)
     }
     
})()