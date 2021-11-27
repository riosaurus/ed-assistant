import { ExtensionContext } from 'vscode';
import { encryptionConfigChangeListenerDisposable } from './config';

export function activate(context: ExtensionContext) {
    context.subscriptions.push(encryptionConfigChangeListenerDisposable);
}

export function deactivate() {}
