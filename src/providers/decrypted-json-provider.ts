import { createDecipheriv } from 'crypto';
import { URLSearchParams } from 'url';
import { CancellationToken, ProviderResult, TextDocumentContentProvider, Uri, window } from 'vscode';
import { getEncryptionConfiguration } from '../config';

export default class DecryptedJSONDocumentProvider implements TextDocumentContentProvider {
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

            const cipherTextEncodedData = queryParams.get("data");
            if (!cipherTextEncodedData) {
                window.showErrorMessage("Ciphertext data not received");
                return;
            }
            
            const cipherTextData = decodeURIComponent(cipherTextEncodedData);
            
            const decipher = createDecipheriv(algorithm, secretKey, initializationVector);
            let plaintext = Buffer.concat([
                decipher.update(cipherTextData, 'base64'),
                decipher.final(),
            ]);
            const jsonData = JSON.parse(plaintext.toString());
            return JSON.stringify(jsonData, null, 2);
        } catch (error: any) {
            window.showErrorMessage(`Couldn't decrypt text: ${error.message}`);
        }
    }
}