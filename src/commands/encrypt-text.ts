import { URLSearchParams } from "url";
import { Uri, window } from "vscode";
import getEncryptionConfig from "../config/get-encryption-config";
import getOutputConfig from "../config/get-output-config";
import { URI_CRYPTO_SCHEME } from "../config/schemes";
import openPlaintextEditor from "../editors/open-plaintext-editor";
import { encrypt } from "../functions/crypto";

export const commandEncryptText = "ed-assistant.encryptText";

export default async function () {
    const algorithm = getEncryptionConfig().get('algorithm');
    const parcelAsRequestObject = getOutputConfig().get('parcelAsRequestObject');
    const text = await window.showInputBox({
        title: "Text to encrypt",
        prompt: `Valid JSON will be ${algorithm} encypted`,
        placeHolder: 'Type / paste JSON',
        validateInput(value) {
            try {
                if (!value) {
                    return "Empty input can't be encrypted";
                }
                JSON.parse(value);
            } catch (error: any) {
                return `Invalid JSON: ${error.message}`;
            }
        }
    });

    if (text) {
        const cipher = encrypt(text);
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
