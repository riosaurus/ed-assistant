import { URLSearchParams } from "url";
import { commands, Uri, window } from "vscode";
import { ENCRYPTION_ALGORITHM } from "../config";
import { URI_ENCRYPTION_SCHEME } from "../config/schemes";
import { openPlainTextEditor } from "../editors";

export const command = "ed-assistant.encryptText";

export default commands.registerCommand(command, async function() {

    const text = await window.showInputBox({
        title: "Text to encrypt",
        prompt: `Valid JSON will be ${ENCRYPTION_ALGORITHM} encypted`,
        validateInput(value) {
            try {
                if (!value) {
                    return "Empty input can't be encrypted";
                }
                JSON.parse(value);
            } catch (error: any) {
                return `Invalid JSON: ${error.message}`;
            }
        }
    });

    if (!text) {
        window.showWarningMessage("Input string not provided");
        return;
    }

    const queryParams = new URLSearchParams({ data: encodeURIComponent(text) });

    const uri = Uri.from({
        scheme: URI_ENCRYPTION_SCHEME,
        path: `${ENCRYPTION_ALGORITHM}-encrypted.txt`,
        query: queryParams.toString(),
    });

    await openPlainTextEditor(uri);
});