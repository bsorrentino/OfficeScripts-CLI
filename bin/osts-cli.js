import minimist from "minimist";
import { exit } from "process";
import { pack } from './osts-pack.js';
import { unpack } from './osts-unpack.js';
import { copyOfficeScriptSimplifiedDeclaration } from "./osts-utils.js";
const DEFAULT_PATH = 'osts';
function help() {
    console.log(`
Usage:
========

osts unpack [--path, -p <dest dir> [--dts] ] // download OSTS package and extract body (.ts) to dest dir (default '${DEFAULT_PATH}'). 
                                             // If --dts is specified an Office Script Simplified TS Declaration  file will be copied in dest dir

osts pack [--path, -p <src dir>] // bundle source (.ts) in src dir (default '${DEFAULT_PATH}') to OSTS package and upload it

osts dts [--path, -p <dest dir>] // an Office Script Simplified TS Declaration file is copied in dest dir
`);
}
// Evaluate command
(async () => {
    const cli = minimist(process.argv.slice(2), {
        '--': false,
        string: 'path',
        boolean: 'dts',
        alias: { 'p': 'path' },
        'default': { 'path': DEFAULT_PATH },
        unknown: (args) => args.toLowerCase() === 'pack' || args.toLowerCase() === 'unpack' || args.toLowerCase() === 'dts'
    });
    // console.log( cli );
    // Check Arguments
    const _cmd = () => (cli._.length > 0) ? cli._[0].toLowerCase() : undefined;
    const _path = () => cli['path']?.length === 0 ? DEFAULT_PATH : cli.path;
    try {
        // console.log( 'path', cli['path'], _path() )
        if (_cmd() === 'pack') {
            const code = await pack(_path());
            exit(code);
        }
        else if (_cmd() === 'unpack') {
            const code = await unpack(_path(), cli['dts']);
            exit(code);
        }
        else if (_cmd() === 'dts') {
            const code = await copyOfficeScriptSimplifiedDeclaration(_path());
            exit(code);
        }
        else {
            help();
            exit(0);
        }
    }
    catch (e) {
        console.error('error occurred!', e);
        exit(-1);
    }
})();
