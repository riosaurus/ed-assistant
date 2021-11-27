import { createCipheriv } from 'crypto';
import { CancellationToken, ProviderResult, TextDocumentContentProvider, Uri } from 'vscode';
import { ENCRYPTION_ALGORITHM, INITIALIZATION_VECTOR, SECRET_KEY } from '../config';

export default class EncryptedTextDocumentProvider implements TextDocumentContentProvider {
    provideTextDocumentContent(uri: Uri, token: CancellationToken): ProviderResult<string> {
        const plainTextData = decodeURIComponent(uri.path);
        const cipher = createCipheriv(ENCRYPTION_ALGORITHM, SECRET_KEY, INITIALIZATION_VECTOR);
        let ciphertext = cipher.update(plainTextData, 'utf-8', 'base64');
        return ciphertext.concat(cipher.final('base64'));
    }
}
