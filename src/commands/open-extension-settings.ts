import { commands } from "vscode";

export const commandOpenExtensionSettings = "ed-assistant.openSettings";

export default function () {
    return commands.executeCommand('workbench.action.openSettings', "@ext:minzie7.ed-assistant");
};