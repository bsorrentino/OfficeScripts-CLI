import minimist from "minimist";
import { exit } from "process";
import { pack } from './osts-pack.js';
import { unpack } from './osts-unpack.js';
import { askForPreferences, copyOfficeScriptSimplifiedDeclaration, listOfficeScript, savePreferences } from "./osts-utils.js";
import { readFile } from 'fs/promises';
const DEFAULT_PATH = 'osts';
async function help() {
    const packageJsonContent = await readFile(new URL('../package.json', import.meta.url));
    const { version } = JSON.parse(packageJsonContent.toString());
    console.log(`
${chalk.blue("osts-cli version: ")}${chalk.bgBlue(version)}

Usage:
========
osts list[--path]  // list OSTS packages in SPO path. 

osts unpack [--path, -p <dest dir> [--dts] ] // download OSTS package and extract body (.ts) to dest dir (default '${DEFAULT_PATH}'). 
                                             // If --dts is specified an Office Script Simplified TS Declaration  file will be copied in dest dir

osts pack [--path, -p <src dir>] // bundle source (.ts) in src dir (default '${DEFAULT_PATH}') to OSTS package and upload it

osts dts [--path, -p <dest dir>] // an Office Script Simplified TS Declaration file is copied in dest dir
`);
}
async function main() {
    const cli = minimist(process.argv.slice(2), {
        '--': false,
        string: ['path', 'version'],
        boolean: 'dts',
        alias: { 'p': 'path' },
        'default': { 'path': DEFAULT_PATH },
        unknown: (args) => /pack|unpack|list|dts/i.test(args)
    });
    // console.log( cli );
    // Check Arguments
    const _cmd = () => (cli._.length > 0) ? cli._[0].toLowerCase() : undefined;
    const _path = () => cli['path']?.length === 0 ? DEFAULT_PATH : cli.path;
    const command = _cmd();
    // console.log( 'command', command, 'path', cli['path'], _path() )
    if (command === 'list') {
        const prefs = await askForPreferences();
        if (!prefs)
            exit(-1);
        const result = await listOfficeScript(prefs);
        console.table(result.map(file => ({
            Name: file.Name,
            Length: `${file.Length} bytes`,
            RelativeUrl: path.dirname(path.relative(prefs.toPath(), file.ServerRelativeUrl))
        })));
        savePreferences(prefs);
        exit(0);
    }
    else if (command === 'pack') {
        const code = await pack(_path(), cli['version']);
        exit(code);
    }
    else if (command === 'unpack') {
        const code = await unpack(_path(), cli['dts']);
        exit(code);
    }
    else if (command === 'dts') {
        const code = await copyOfficeScriptSimplifiedDeclaration(_path());
        exit(code);
    }
    else {
        await help();
        exit(0);
    }
}
// Evaluate command
(async () => {
    try {
        await main();
    }
    catch (e) {
        console.error('error occurred!', e);
        exit(-1);
    }
})();
