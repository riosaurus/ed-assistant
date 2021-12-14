import { commands, ExtensionContext, window, workspace } from 'vscode';
import { cmdDecryptText, cmdEncryptText, cmdOpenExtensionSettings } from './commands';
import { getEncryptionConfiguration, Schemes } from './config';
import { DecryptedJSONDocumentProvider, EncryptedTextDocumentProvider } from './providers';

export async function activate(context: ExtensionContext) {

    const encryptionConfig = getEncryptionConfiguration();
    const isInitializationVectorSet = !!encryptionConfig.get('initializationVector');
    const isSecretKeySet = !!encryptionConfig.get('secretKey');

    if (!isInitializationVectorSet || !isSecretKeySet) {
        const choice = await window.showWarningMessage(
            "Please ensure both Secret Key and Initialization Vector to be set in Extension settings. Open extension settings?",
            "Open",
        );
        if (choice === "Open") {
            await commands.executeCommand("ed-assistant.openSettings");
        } else {
            deactivate();
        }
    }

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
    );
}

export function deactivate() {}
