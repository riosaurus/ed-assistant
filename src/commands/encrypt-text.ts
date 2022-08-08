import { URLSearchParams } from "url";
import { Uri, window } from "vscode";
import { getEncryptionConfiguration, getOutputConfiguration, Schemes } from "../config";
import { openPlainTextEditor } from "../editors";
import { encrypt } from "../functions/crypto";

export const commandEncryptText = "ed-assistant.encryptText";

export default async function () {
    const algorithm = getEncryptionConfiguration().get('algorithm');
    const parcelAsRequestObject = getOutputConfiguration().get('parcelAsRequestObject');
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
            scheme: Schemes.URI_CRYPTO_SCHEME,
            path: `${algorithm}-encrypted.${parcelAsRequestObject ? 'json' : 'txt'}`,
            query: queryParams.toString(),
        });

        await openPlainTextEditor(uri);
    }
};