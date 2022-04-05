import clipboard from "clipboardy";
import { window } from "vscode";
import { getOutputConfiguration } from "../config";

export function copyToClipboard(data: string): void {
    const copyToClipboard = getOutputConfiguration().get('copyToClipboard');
    if (copyToClipboard) {
        clipboard
            .write(data)
            .then(() => window.showInformationMessage("Output copied to clipboard"))
            .catch(() => window.showErrorMessage("Couldn't auto-copy output to clipboard"));
    }
    return;
}