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

async function main() {
    const content = await fsreadFile( osts_source )

    const osts = JSON.parse( content.toString() ) as OSTS

    await fswriteFile( path.join('src', `FillWeek_${osts.version}.ts`), osts.body )
}


(async() => main() )()