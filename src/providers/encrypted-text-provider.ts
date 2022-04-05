import { URLSearchParams } from 'url';
import { CancellationToken, ProviderResult, TextDocumentContentProvider, Uri, window } from 'vscode';
import { copyToClipboard } from '../utilities/clipboard';
import { getEncryptedBuffer } from '../utilities/encyption-decryption';

export default class EncryptedTextDocumentProvider implements TextDocumentContentProvider {
    provideTextDocumentContent(uri: Uri, token: CancellationToken): ProviderResult<string> {
        try {
            const queryParams = new URLSearchParams(uri.query);  
            const data = queryParams.get("data");
            if (!data) {
                window.showErrorMessage("Plain Text data not received");
                return;
            }

            const encryptedData = getEncryptedBuffer(
                decodeURIComponent(data),
                'utf-8',
            ).toString('base64');

            copyToClipboard(encryptedData);
            
            return encryptedData;
        } catch (error: any) {
            window.showErrorMessage(`Couldn't encrypt text: ${error.message}`);
        }
    }
}
