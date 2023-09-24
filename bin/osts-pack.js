import 'zx/globals';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { askForPreferences, chooseFile, loadOSTS, savePreferences } from './osts-utils.js';
const fsreadFile = promisify(fs.readFile);
const fswriteFile = promisify(fs.writeFile);
const fsreaddir = promisify(fs.readdir);
const askForConfirmUpload = async () => {
    const answer = (await question('do you want upload file? (Y/n): '))
        .trim()
        .toLowerCase();
    if (answer.length === 0 || answer === 'y')
        return true;
    return false;
};
export async function pack(bodyDirPath, version) {
    return within(async () => {
        const dir = await fsreaddir(path.dirname(bodyDirPath));
        console.debug('dir', dir);
        const osts_files = dir.filter(n => path.extname(n) === '.osts');
        const selectedFile = await chooseFile(osts_files, (file) => file);
        console.debug('selectedFile', selectedFile);
        if (!selectedFile) {
            return -1;
        }
        const selectedFilePath = path.join(path.dirname(bodyDirPath), selectedFile);
        console.debug('selectFilePath', selectedFilePath);
        const osts = await loadOSTS(selectedFilePath, bodyDirPath);
        const body_source = await fsreadFile(osts.bodyFilePath);
        osts.body = body_source.toString();
        await fswriteFile(selectedFilePath, JSON.stringify(osts));
        const upload = await askForConfirmUpload();
        if (!upload)
            return 1;
        const prefs = await askForPreferences();
        if (!prefs)
            return 1;
        await $ `m365 spo file add  --webUrl ${prefs.weburl} --folder ${prefs.folder} --path ${selectedFilePath}`;
        savePreferences(prefs);
        return 0;
    });
}
