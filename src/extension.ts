import { commands, ExtensionContext, window, workspace } from 'vscode';
import decryptText, { commandDecryptText } from './commands/decrypt-text';
import encryptDocument, { commandEncryptDocument } from './commands/encrypt-document';
import encryptSelection, { commandEncryptSelection } from './commands/encrypt-selection';
import encryptText, { commandEncryptText } from './commands/encrypt-text';
import openExtensionSettings, { commandOpenExtensionSettings } from './commands/open-extension-settings';
import { getEncryptionConfiguration, Schemes } from './config';
import { EditorProvider } from './providers';

export async function activate(context: ExtensionContext) {

    const encryptionConfig = getEncryptionConfiguration();

    if (encryptionConfig.has('initializationVector') && encryptionConfig.has('secretKey')) {
        const cmdOpenExtensionSettings = commands.registerCommand(commandOpenExtensionSettings, openExtensionSettings);
        const cmdEncryptText = commands.registerCommand(commandEncryptText, encryptText);
        const cmdEncryptDocument = commands.registerCommand(commandEncryptDocument, encryptDocument);
        const cmdEncryptSelection = commands.registerCommand(commandEncryptSelection, encryptSelection);
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
