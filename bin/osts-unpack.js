import 'zx/globals';
import { chooseFile, loadOSTS, askForPreferences, savePreferences, copyOfficeScriptSimplifiedDeclaration as CP_D_TS, listOfficeScript } from './osts-utils.js';
/**
 * Unpacks an Office Script (.osts) file into its source code.
 *
 * @param {string} bodyDirPath - The directory to extract the script source code
 * @param {ParsedArgs} cli - The command line arguments
 * @returns {Promise<number>} - 0 if successful, error code otherwise
 */
export async function unpack(bodyDirPath, cli) {
    const { dts: copyOfficeScriptSimplifiedDeclaration } = cli;
    const prefs = await askForPreferences();
    if (!prefs)
        return 0;
    try {
        $.verbose = false;
        const spoFileListResult = await listOfficeScript(prefs);
        if (!spoFileListResult.length || spoFileListResult.length === 0) {
            console.error(`no OSTS files detected at folder '${prefs.folder}`);
            return -1;
        }
        const selectedFile = await chooseFile(spoFileListResult, (file) => file.Name);
        if (!selectedFile) {
            return -1;
        }
        const outputFilePath = path.join(path.dirname(bodyDirPath), selectedFile.Name);
        // $.verbose = true
        // console.debug( selectedFile.Name, 'outputPath', outputPath)
        await $ `m365 spo file get --webUrl ${prefs.weburl} --id ${selectedFile.UniqueId} --asFile --path ${outputFilePath}`;
        // Extract body
        const osts = await loadOSTS(outputFilePath, bodyDirPath);
        //console.debug( 'bodyDirPath', bodyDirPath, 'bodyFilePath', osts.bodyFilePath )
        const dir = path.dirname(osts.bodyFilePath);
        await fs.ensureDir(dir);
        await fs.writeFile(osts.bodyFilePath, osts.body);
        // Copy declaration files if needed
        if (copyOfficeScriptSimplifiedDeclaration) {
            await CP_D_TS(bodyDirPath);
        }
        savePreferences(prefs);
    }
    catch (e) {
        console.error('error searching file', e);
        return -1;
    }
    return 0;
}
