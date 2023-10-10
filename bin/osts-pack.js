import 'zx/globals';
import { askForPreferences, chooseFile, loadOSTS, savePreferences } from './osts-utils.js';
/**
 * Asks the user to confirm if they want to upload the given file.
 *
 * @param {string} file - The file path to upload
 * @returns {Promise<boolean>} - Promise resolving to true if user confirms upload, false otherwise
 */
const askForConfirmUpload = async (file) => {
    const answer = (await question(`do you want upload file '${file}' ? (Y/n):`))
        .trim()
        .toLowerCase();
    if (answer.length === 0 || answer === 'y')
        return true;
    return false;
};
/**
 * Packs an Office Script into a .osts file for uploading.
 *
 * @param {string} bodyDirPath - The directory containing Office Script .ts files
 * @param {ParsedArgs} cli - The CLI args object
 */
export async function pack(bodyDirPath, cli) {
    const { file } = cli;
    const dir = await fs.readdir(path.dirname(bodyDirPath));
    // console.debug( 'dir', dir)
    const osts_files = dir.filter(n => path.extname(n) === '.osts');
    let selectedFile;
    if (file) {
        selectedFile = osts_files.find(f => f === file || path.basename(f, '.osts') === file);
    }
    if (!selectedFile) {
        selectedFile = await chooseFile(osts_files, (file) => file);
        // console.debug( 'selectedFile', selectedFile)    
        if (!selectedFile) {
            return -1;
        }
    }
    const selectedFilePath = path.join(path.dirname(bodyDirPath), selectedFile);
    // console.debug( 'selectFilePath', selectedFilePath)
    const osts = await loadOSTS(selectedFilePath, bodyDirPath);
    const body_source = await fs.readFile(osts.bodyFilePath);
    osts.body = body_source.toString();
    await fs.writeFile(selectedFilePath, JSON.stringify(osts));
    const upload = await askForConfirmUpload(selectedFile);
    if (!upload)
        return 1;
    const prefs = await askForPreferences();
    if (!prefs)
        return 1;
    await $ `m365 spo file add  --webUrl ${prefs.weburl} --folder ${prefs.folder} --path ${selectedFilePath}`;
    savePreferences(prefs);
    return 0;
}
