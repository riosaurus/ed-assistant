import { commands, ExtensionContext, window, workspace } from 'vscode';
import { cmdDecryptText, cmdEncryptDocument, cmdEncryptSelection, cmdEncryptText, cmdOpenExtensionSettings } from './commands';
import { getEncryptionConfiguration, Schemes } from './config';
import { EditorProvider } from './providers';

export async function activate(context: ExtensionContext) {

    const encryptionConfig = getEncryptionConfiguration();
    const isInitializationVectorSet = !!encryptionConfig.get('initializationVector');
    const isSecretKeySet = !!encryptionConfig.get('secretKey');

     const editorProviderDisposable = workspace.registerTextDocumentContentProvider(
        Schemes.URI_CRYPTO_SCHEME,
        new EditorProvider(),
    );

    context.subscriptions.push(
        cmdOpenExtensionSettings,
        cmdEncryptText,
        cmdEncryptDocument,
        cmdEncryptSelection,
        cmdDecryptText,
        editorProviderDisposable,
    );

    if (!isInitializationVectorSet || !isSecretKeySet) {
        const choice = await window.showWarningMessage(
            "Please ensure both Secret Key and Initialization Vector to be set in Extension settings. Open extension settings?",
            "Open",
        );
        if (choice === "Open") {
            await commands.executeCommand("ed-assistant.openSettings");
        }
        while (context.subscriptions.length) {
            context.subscriptions.pop();
        }
    }
}

export function deactivate() {}
