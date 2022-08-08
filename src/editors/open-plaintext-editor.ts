import { TextEditor, Uri, ViewColumn, window, workspace } from "vscode";
import getOutputConfig from "../config/get-output-config";

export default async function (uri: Uri): Promise<TextEditor | undefined> {
    try {
        const openToTheSide = getOutputConfig().get("openToTheSide");
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
