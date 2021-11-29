import { TextEditor, Uri, ViewColumn, window, workspace } from "vscode";

async function openPlainTextEditor(uri: Uri): Promise<TextEditor | undefined> {
    try {
        const textDocument = await workspace.openTextDocument(uri);
        const textEditor = await window.showTextDocument(textDocument, {
            preview: false,
            viewColumn: ViewColumn.Beside,
        });
        return textEditor;
    } catch (error: any) {
        window.showErrorMessage(`Couldn't open the editor: ${error.message}`);
        return;
    }
}

export default openPlainTextEditor;