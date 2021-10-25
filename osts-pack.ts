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

const osts_source = 'FillWeek.osts'
const osts_body = path.join('src', 'FillWeek_0.2.0.ts' )

const osts_dest = osts_source

const fsreadFile = promisify(fs.readFile)
const fswriteFile = promisify(fs.writeFile)


async function main() {
    const content = await fsreadFile( osts_source )
    const body = await fsreadFile( osts_body )

    const osts = JSON.parse( content.toString() ) as OSTS

    osts.body = body.toString()

    await fswriteFile( osts_dest, JSON.stringify(osts) )
}


(async() => main() )()