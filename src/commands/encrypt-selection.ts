import { URLSearchParams } from "url";
import { Uri, window } from "vscode";
import getEncryptionConfig from "../config/get-encryption-config";
import getOutputConfig from "../config/get-output-config";
import { URI_CRYPTO_SCHEME } from "../config/schemes";
import openPlaintextEditor from "../editors/open-plaintext-editor";
import { encrypt } from "../functions/crypto";

export const commandEncryptSelection = "ed-assistant.encryptSelection";

export default async function () {
    const algorithm = getEncryptionConfig().get('algorithm');
    const parcelAsRequestObject = getOutputConfig().get('parcelAsRequestObject');
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
            scheme: URI_CRYPTO_SCHEME,
            path: `${algorithm}-encrypted.${parcelAsRequestObject ? 'json' : 'txt'}`,
            query: queryParams.toString(),
        });

        await openPlaintextEditor(uri);
    }
}
