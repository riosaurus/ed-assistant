import { ExtensionContext } from 'vscode';
import { cmdOpenExtensionSettings } from './commands';
import { encryptionConfigChangeListenerDisposable } from './config';

export function activate(context: ExtensionContext) {
    context.subscriptions.push(
        cmdOpenExtensionSettings,
        encryptionConfigChangeListenerDisposable,
    );
}

export function deactivate() {}
