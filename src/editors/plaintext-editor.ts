import { TextEditor, Uri, window, workspace } from "vscode";

async function openPlainTextEditor(uri: Uri): Promise<TextEditor | undefined> {
    try {
        const textDocument = await workspace.openTextDocument(uri);
        const textEditor = await window.showTextDocument(textDocument, { preview: false });
        return textEditor;
    } catch (error) {
        window.showErrorMessage("Couldn't open the editor");
        return;
    }
}

export default openPlainTextEditor;