import { URLSearchParams } from "url";
import { commands, Uri, window } from "vscode";
import { ENCRYPTION_ALGORITHM } from "../config";
import { URI_DECRYPTION_SCHEME } from "../config/schemes";
import { openPlainTextEditor } from "../editors";

export const command = "ed-assistant.decryptText";

export default commands.registerCommand(command, async function() {

    const text = await window.showInputBox({
        title: "Text to decrypt",
    });

    if (!text) {
        window.showWarningMessage("Input string not provided");
        return;
    }

    const queryParams = new URLSearchParams({ data: encodeURIComponent(text) });

    const uri = Uri.from({
        scheme: URI_DECRYPTION_SCHEME,
        path: `${ENCRYPTION_ALGORITHM}-decrypted.json`,
        query: queryParams.toString(),
    });

    await openPlainTextEditor(uri);
});
