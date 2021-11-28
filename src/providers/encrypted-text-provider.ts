import { createCipheriv } from 'crypto';
import { URLSearchParams } from 'url';
import { CancellationToken, ProviderResult, TextDocumentContentProvider, Uri, window } from 'vscode';
import { ENCRYPTION_ALGORITHM, INITIALIZATION_VECTOR, SECRET_KEY } from '../config';

export default class EncryptedTextDocumentProvider implements TextDocumentContentProvider {
    provideTextDocumentContent(uri: Uri, token: CancellationToken): ProviderResult<string> {
        try {
            const queryParams = new URLSearchParams(uri.query);
            const plainTextEncodedData = queryParams.get("data");
            if (!plainTextEncodedData) {
                throw new Error("Plain Text data not received");
            }
            const plainTextData = decodeURIComponent(plainTextEncodedData);
            const cipher = createCipheriv(ENCRYPTION_ALGORITHM, SECRET_KEY, INITIALIZATION_VECTOR);
            let ciphertext = cipher.update(plainTextData, 'utf-8', 'base64');
            return ciphertext + cipher.final('base64');
        } catch (error: any) {
            window.showErrorMessage(`Couldn't encrypt text. Reason: ${error.message}`);
        }
    }
}
