import { commands, Uri, window } from "vscode";
import { URI_ENCRYPTION_SCHEME } from "../config/schemas";
import { openPlainTextEditor } from "../editors";

export const command = "ed-assistant.encryptText";

export default commands.registerCommand(command, async function() {

    const text = await window.showInputBox({
        title: "Text to encrypt",
    });

    if (!text) {
        window.showWarningMessage("Input string not provided");
        return;
    }

    const uri = Uri.from({
        scheme: URI_ENCRYPTION_SCHEME,
        path: "encrypted-output.txt",
        query: `data=${encodeURIComponent(text)}`
    });

    await openPlainTextEditor(uri);
});