import { commands, ExtensionContext, window, workspace } from 'vscode';
import { cmdEncryptDocument, cmdEncryptSelection, cmdOpenExtensionSettings } from './commands';
import decryptText, { commandDecryptText } from './commands/decrypt-text';
import encryptText, { commandEncryptText } from './commands/encrypt-text';
import { getEncryptionConfiguration, Schemes } from './config';
import { EditorProvider } from './providers';

export async function activate(context: ExtensionContext) {

    const encryptionConfig = getEncryptionConfiguration();

    if (encryptionConfig.has('initializationVector') && encryptionConfig.has('secretKey')) {
        const cmdEncryptText = commands.registerCommand(commandEncryptText, encryptText);
        const cmdDecryptText = commands.registerCommand(commandDecryptText, decryptText);

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
    } else {
        const choice = await window.showWarningMessage(
            "Please ensure both Secret Key and Initialization Vector to be set in Extension settings. Open extension settings?",
            "Open",
        );
        if (choice === "Open") {
            await commands.executeCommand("ed-assistant.openSettings");
        }
    }
}

export function deactivate() {}
