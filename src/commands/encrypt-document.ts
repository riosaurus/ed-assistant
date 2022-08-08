import { URLSearchParams } from "url";
import { Uri, window } from "vscode";
import { getEncryptionConfiguration, getOutputConfiguration, Schemes } from "../config";
import { openPlainTextEditor } from "../editors";
import { encrypt } from "../functions/crypto";

export const commandEncryptDocument = "ed-assistant.encryptDocument";

export default async function () {
    const algorithm = getEncryptionConfiguration().get('algorithm');
    const parcelAsRequestObject = getOutputConfiguration().get('parcelAsRequestObject');
    const documentData = window.activeTextEditor?.document.getText();
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
};