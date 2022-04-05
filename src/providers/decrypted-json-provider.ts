import { URLSearchParams } from 'url';
import { CancellationToken, ProviderResult, TextDocumentContentProvider, Uri, window } from 'vscode';
import { copyToClipboard } from '../utilities/clipboard';
import { getDecryptedBuffer } from '../utilities/encyption-decryption';

export default class DecryptedJSONDocumentProvider implements TextDocumentContentProvider {
    provideTextDocumentContent(uri: Uri, token: CancellationToken): ProviderResult<string> {
        try {            
            const queryParams = new URLSearchParams(uri.query);
            const data = queryParams.get("data");
            if (!data) {
                window.showErrorMessage("Ciphertext data not received");
                return;
            }
            
            const decryptedData = getDecryptedBuffer(
                decodeURIComponent(data),
                'base64',
            ).toString('utf-8');
            const jsonData = JSON.parse(decryptedData);
            const stringifiedData = JSON.stringify(jsonData, null, 2);

            copyToClipboard(stringifiedData);
            return stringifiedData;
        } catch (error: any) {
            window.showErrorMessage(`Couldn't decrypt text: ${error.message}`);
        }
    }
}