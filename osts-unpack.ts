import * as fs from 'fs'
import * as path from 'path'
import {promisify } from 'util'

interface OSTS {
    "version": string,
    "body": string
    "description": string,
    "parameterInfo": string
    "apiInfo": string

}

const fsopen = promisify(fs.open)
const fsreadFile = promisify(fs.readFile)
const fswriteFile = promisify(fs.writeFile)

const osts_source = 'FillWeek.osts'
const osts_body = path.join('dist', 'FillWeek_0.2.0.ts' )

async function main() {
    const content = await fsreadFile( 'FillWeek.osts' )

    const osts = JSON.parse( content.toString() ) as OSTS

    await fswriteFile( `FillWeek_${osts.version}.ts`, osts.body )
}


(async() => main() )()