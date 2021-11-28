import { createDecipheriv } from 'crypto';
import { URLSearchParams } from 'url';
import { CancellationToken, ProviderResult, TextDocumentContentProvider, Uri, window } from 'vscode';
import { ENCRYPTION_ALGORITHM, INITIALIZATION_VECTOR, SECRET_KEY } from '../config';

export default class DecryptedJSONDocumentProvider implements TextDocumentContentProvider {
    provideTextDocumentContent(uri: Uri, token: CancellationToken): ProviderResult<string> {
        try {
            const queryParams = new URLSearchParams(uri.query);
            const cipherTextEncodedData = queryParams.get("data");
            if (!cipherTextEncodedData) {
                throw new Error("Ciphertext data not received");
            }
            const cipherTextData = decodeURIComponent(cipherTextEncodedData);

            const decipher = createDecipheriv(ENCRYPTION_ALGORITHM, SECRET_KEY, INITIALIZATION_VECTOR);
            let plaintext = Buffer.concat([
                decipher.update(cipherTextData, 'base64'),
                decipher.final(),
            ]);

            const jsonData = JSON.parse(plaintext.toString());

            return JSON.stringify(jsonData, null, 2);
        } catch (error: any) {
            window.showErrorMessage(`Couldn't decrypt text. Reason: ${error.message}`);
        }
    }
}