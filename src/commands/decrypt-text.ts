import { URLSearchParams } from "url";
import { Uri, window } from "vscode";
import getEncryptionConfig from "../config/get-encryption-config";
import { URI_CRYPTO_SCHEME } from "../config/schemes";
import openPlainTextEditor from "../editors/open-plaintext-editor";
import { decrypt } from "../functions/crypto";

export const commandDecryptText = "ed-assistant.decryptText";

export default async function () {
    const algorithm = getEncryptionConfig().get('algorithm');
    const text = await window.showInputBox({
        title: "Text to decrypt",
        prompt: `Valid ciphertext will be ${algorithm} decypted`,
        validateInput(value) {
            if (!value) {
                return "Empty input can't be decrypted";
            }
        }
    });

    if (text) {
        const data = decrypt(text);
        let uri;
        try {
            const parsedJSON = JSON.parse(data);
            const queryParams = new URLSearchParams({
                data: encodeURIComponent(JSON.stringify(parsedJSON, null, 2))
            });
            uri = Uri.from({
                scheme: URI_CRYPTO_SCHEME,
                path: `${algorithm}-decrypted.json`,
                query: queryParams.toString(),
            });
        } catch (error) {
            const queryParams = new URLSearchParams({
                data: encodeURIComponent(data)
            });
            uri = Uri.from({
                scheme: URI_CRYPTO_SCHEME,
                path: `${algorithm}-decrypted.txt`,
                query: queryParams.toString(),
            });
        }
        await openPlainTextEditor(uri);
    }
}
