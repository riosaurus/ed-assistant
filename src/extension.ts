import { commands, ExtensionContext, window, workspace, env } from 'vscode';
import decryptText, { commandDecryptText } from './commands/decrypt-text';
import encryptDocument, { commandEncryptDocument } from './commands/encrypt-document';
import encryptSelection, { commandEncryptSelection } from './commands/encrypt-selection';
import encryptText, { commandEncryptText } from './commands/encrypt-text';
import openExtensionSettings, { commandOpenExtensionSettings } from './commands/open-extension-settings';
import { getEncryptionConfiguration, Schemes } from './config';
import { EditorProvider } from './providers';

export async function activate(context: ExtensionContext) {

    const encryptionConfig = getEncryptionConfiguration();
    const cmdOpenExtensionSettings = commands.registerCommand(commandOpenExtensionSettings, openExtensionSettings);
    context.subscriptions.push(cmdOpenExtensionSettings);

    if (encryptionConfig.get('initializationVector')?.length && encryptionConfig.get('secretKey')?.length) {
        const cmdEncryptText = commands.registerCommand(commandEncryptText, encryptText);
        const cmdEncryptDocument = commands.registerCommand(commandEncryptDocument, encryptDocument);
        const cmdEncryptSelection = commands.registerCommand(commandEncryptSelection, encryptSelection);
        const cmdDecryptText = commands.registerCommand(commandDecryptText, decryptText);

        const editorProviderDisposable = workspace.registerTextDocumentContentProvider(
            Schemes.URI_CRYPTO_SCHEME,
            new EditorProvider(),
        );
    
        context.subscriptions.push(
            cmdEncryptText,
            cmdEncryptDocument,
            cmdEncryptSelection,
            cmdDecryptText,
            editorProviderDisposable,
        );
    } else {
        const choice = await window.showWarningMessage(
            "Please set the secrets in Extension settings and reload the window. Open extension settings now?",
            "Open",
        );
        if (choice === "Open") {
            openExtensionSettings();
        }
    }
}

export function deactivate() {}
