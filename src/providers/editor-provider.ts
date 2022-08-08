import { URLSearchParams } from 'url';
import { CancellationToken, ProviderResult, TextDocumentContentProvider, Uri, window } from 'vscode';

export default class EditorProvider implements TextDocumentContentProvider {
    provideTextDocumentContent(uri: Uri, token: CancellationToken): ProviderResult<string> {
        try {
            const queryParams = new URLSearchParams(uri.query);
            const data = queryParams.get("data")!!;
            return decodeURIComponent(data);
        } catch (error: any) {
            window.showErrorMessage(`Couldn't render data: ${error.message}`);
        }
    }
}
