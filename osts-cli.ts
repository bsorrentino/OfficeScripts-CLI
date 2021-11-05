import minimist, {ParsedArgs } from "minimist";
import { exit } from "process";
import { pack } from './osts-pack'
import { unpack } from './osts-unpack'

function help() {
    
}

type OSTSCLI = ParsedArgs 


// Evaluate command
(async() => { 

    const cli:OSTSCLI = minimist( process.argv.slice(2), { 
        '--':false,
        string: 'path',
        alias: { 'p': 'path'},
        'default': { 'path' : 'src'},
        unknown: (args: string) => args.toLowerCase()==='pack' || args.toLowerCase()==='unpack'
    })
    
    console.log( cli );

    // Check Arguments
    const _cmd = () => 
        (cli._.length >  0) ? cli._[0].toLowerCase() : undefined
    
    const _path = () =>     
        cli['path']?.length === 0 ? 'src' : cli.path!


    try {

        if( _cmd() === 'pack') {
            const code = await pack( _path() )
            exit(code)
        }
        else if( _cmd() === 'unpack' ) {
            const code = await unpack( _path() )
            //exit(code)
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


