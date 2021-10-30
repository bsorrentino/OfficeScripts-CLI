import * as fs from 'fs'
import * as path from 'path'
import { exit } from 'process'
import {promisify } from 'util'
import {$, question } from 'zx'

import { chooseFile, loadOSTS } from './osts-utils'

const osts_source = 'FillWeek.osts'
const osts_body = path.join('src', 'FillWeek_0.2.0.ts' )

const osts_dest = osts_source

const fsreadFile = promisify(fs.readFile)
const fswriteFile = promisify(fs.writeFile)
const fsreaddir = promisify(fs.readdir)


async function main() {

    const osts_files = (await fsreaddir( '.' ))
        .filter( n => path.extname(n)==='.osts')
        
    const selectedFile = await chooseFile(osts_files, (file) => file )
    if( !selectedFile ) {
        exit(-1)
    }

    const osts = await loadOSTS( selectedFile )

    const body_source = await fsreadFile( osts.bodyFilePath )

    osts.body = body_source.toString()

    await fswriteFile( selectedFile, JSON.stringify(osts) )
}


(async() => main() )()