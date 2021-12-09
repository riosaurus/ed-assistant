import { createCipheriv } from 'crypto';
import { URLSearchParams } from 'url';
import { CancellationToken, ProviderResult, TextDocumentContentProvider, Uri, window } from 'vscode';
import { getEncryptionConfiguration } from '../config';

export default class EncryptedTextDocumentProvider implements TextDocumentContentProvider {
    provideTextDocumentContent(uri: Uri, token: CancellationToken): ProviderResult<string> {
        try {
            const encryptionConfig = getEncryptionConfiguration();
            const algorithm = encryptionConfig.get("algorithm", "aes-128-cbc");
            
            const secretKey = encryptionConfig.get("secretKey");
            if (!secretKey) {
                window.showErrorMessage("Looks like you haven't set the Secret Key");
                return;
            }

            const initializationVector = encryptionConfig.get("initializationVector");
            if (!initializationVector) {
                window.showErrorMessage("Looks like you haven't set the Initialization Vector");
                return;
            }

            const queryParams = new URLSearchParams(uri.query);
  
            const plainTextEncodedData = queryParams.get("data");
            if (!plainTextEncodedData) {
                window.showErrorMessage("Plain Text data not received");
                return;
            }
            const plainTextData = decodeURIComponent(plainTextEncodedData);

            const cipher = createCipheriv(algorithm, secretKey, initializationVector);
            let ciphertext = cipher.update(plainTextData, 'utf-8', 'base64');
            return ciphertext + cipher.final('base64');
        } catch (error: any) {
            window.showErrorMessage(`Couldn't encrypt text: ${error.message}`);
        }
    }
}
