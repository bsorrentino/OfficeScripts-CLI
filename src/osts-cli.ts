import minimist, {ParsedArgs } from "minimist";
import { exit } from "process";
import { pack } from './osts-pack'
import { unpack } from './osts-unpack'

const DEFAULT_PATH = 'osts'

type OSTSCLI = ParsedArgs 

function help() {
    console.log(`
Usage:
========

osts unpack [--path, -p <dest dir>] // download OSTS package and extract body (.ts) to dest dir (default '${DEFAULT_PATH}')

osts pack [--path, -p <src dir>] // bundle source (.ts) in src dir (default '${DEFAULT_PATH}') to OSTS package and upload it
`)
}

// Evaluate command
(async() => { 

    const cli:OSTSCLI = minimist( process.argv.slice(2), { 
        '--':false,
        string: 'path',
        alias: { 'p': 'path'},
        'default': { 'path' : DEFAULT_PATH},
        unknown: (args: string) => args.toLowerCase()==='pack' || args.toLowerCase()==='unpack'
    })
    
    // console.log( cli );

    // Check Arguments
    const _cmd = () => 
        (cli._.length >  0) ? cli._[0].toLowerCase() : undefined
    
    const _path = () =>     
        cli['path']?.length === 0 ? DEFAULT_PATH : cli.path!

    try {

        if( _cmd() === 'pack') {
            const code = await pack( _path() )
            exit(code)
        }
        else if( _cmd() === 'unpack' ) {
            const code = await unpack( _path() )
            exit(code)
        }
        else {
            help()
            exit(0)
        }
 }
     catch( e ) {
         console.error( 'error occurred!', e)
         exit(-1)
     }
     
})()


