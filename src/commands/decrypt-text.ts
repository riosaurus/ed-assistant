import { URLSearchParams } from "url";
import { commands, Uri, window } from "vscode";
import { getEncryptionConfiguration, Schemes } from "../config";
import { openPlainTextEditor } from "../editors";

export const command = "ed-assistant.decryptText";

export default commands.registerCommand(command, async function () {

    const encryptionConfig = getEncryptionConfiguration();
    const algorithm = encryptionConfig.get("algorithm", "aes-128-cbc");
    const text = await window.showInputBox({
        title: "Text to decrypt",
        prompt: `Valid ciphertext will be ${algorithm} decypted`,
        validateInput(value) {
            if (!value) {
                return "Empty input can't be decrypted";
            }
        }
    });

    if (!text) {
        window.showWarningMessage("Input string not provided");
        return;
    }

    const queryParams = new URLSearchParams({ data: encodeURIComponent(text) });

    const uri = Uri.from({
        scheme: Schemes.URI_DECRYPTION_SCHEME,
        path: `${algorithm}-decrypted.json`,
        query: queryParams.toString(),
    });

    await openPlainTextEditor(uri);
});
