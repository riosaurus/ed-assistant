import { TextEditor, Uri, ViewColumn, window, workspace } from "vscode";
import { getOutputConfiguration } from "../config";

async function openPlainTextEditor(uri: Uri): Promise<TextEditor | undefined> {
    try {
        const openToTheSide = getOutputConfiguration().get("openToTheSide");
        const textDocument = await workspace.openTextDocument(uri);
        const textEditor = await window.showTextDocument(textDocument, {
            preview: true,
            viewColumn: openToTheSide ? ViewColumn.Beside : undefined,
        });
        return textEditor;
    } catch (error: any) {
        window.showErrorMessage(`Couldn't open the editor: ${error.message}`);
        return;
    }
}

export default openPlainTextEditor;