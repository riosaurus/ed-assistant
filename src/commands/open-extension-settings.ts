import { commands } from "vscode";

export const command = "ed-assistant.openSettings";

export default commands.registerCommand(command, async function() {
    await commands.executeCommand('workbench.action.openSettings', "@ext:minzie7.ed-assistant");
});