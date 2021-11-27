import { ExtensionContext, workspace } from 'vscode';
import { cmdOpenExtensionSettings } from './commands';
import { encryptionConfigChangeListenerDisposable, Schemes } from './config';
import { EncryptedTextDocumentProvider } from './providers';

export function activate(context: ExtensionContext) {

    const encryptedDocProviderDisposable = workspace.registerTextDocumentContentProvider(
        Schemes.URI_ENCRYPTION_SCHEME,
        new EncryptedTextDocumentProvider()
    );

    context.subscriptions.push(
        cmdOpenExtensionSettings,
        encryptedDocProviderDisposable,
        encryptionConfigChangeListenerDisposable,
    );
}

export function deactivate() {}
