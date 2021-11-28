import { ExtensionContext, workspace } from 'vscode';
import { cmdDecryptText, cmdEncryptText, cmdOpenExtensionSettings } from './commands';
import { encryptionConfigChangeListenerDisposable, Schemes } from './config';
import { DecryptedJSONDocumentProvider, EncryptedTextDocumentProvider } from './providers';

export function activate(context: ExtensionContext) {

    const encryptedDocProviderDisposable = workspace.registerTextDocumentContentProvider(
        Schemes.URI_ENCRYPTION_SCHEME,
        new EncryptedTextDocumentProvider()
    );

    const decryptedDocProviderDisposable = workspace.registerTextDocumentContentProvider(
        Schemes.URI_DECRYPTION_SCHEME,
        new DecryptedJSONDocumentProvider()
    );

    context.subscriptions.push(
        cmdOpenExtensionSettings,
        cmdEncryptText,
        cmdDecryptText,
        encryptedDocProviderDisposable,
        decryptedDocProviderDisposable,
        encryptionConfigChangeListenerDisposable,
    );
}

export function deactivate() {}
