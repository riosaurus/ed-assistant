import { URLSearchParams } from "url";
import { commands, Uri, window } from "vscode";
import { getEncryptionConfiguration, getOutputConfiguration, Schemes } from "../config";
import { openPlainTextEditor } from "../editors";
import { encrypt } from "../functions/crypto";

export const command = "ed-assistant.encryptSelection";

export default commands.registerCommand(command, async () => {
    const algorithm = getEncryptionConfiguration().get('algorithm');
    const parcelAsRequestObject = getOutputConfiguration().get('parcelAsRequestObject');
    const editor = window.activeTextEditor;
    const documentData = editor?.document.getText(editor.selection);
    if (documentData) {
        const cipher = encrypt(documentData);
        const data = parcelAsRequestObject ?
            JSON.stringify({ request: cipher }, null, 2)
            : cipher;
        const queryParams = new URLSearchParams({
            data: encodeURIComponent(data),
        });
        const uri = Uri.from({
            scheme: Schemes.URI_CRYPTO_SCHEME,
            path: `${algorithm}-encrypted.${parcelAsRequestObject ? 'json' : 'txt'}`,
            query: queryParams.toString(),
        });

        await openPlainTextEditor(uri);
    }
});