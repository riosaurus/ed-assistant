import { commands, window, workspace } from "vscode";

const _config = workspace.getConfiguration("ed-assistant.encryption");

function _initializationVector(
    showAlert = true,
    value = _config.get<string>("initializationVector")
): string {
    if (showAlert && !value) {
        window
            .showWarningMessage(
                "Initialization Vector not set in extension settings",
                "Set IV"
            )
            .then(function () {
                commands.executeCommand(
                    "workbench.action.openSettings",
                    "ed-assistant.encryption.initializationVector"
                );
            });
    }
    return value || "";
}

export let INITIALIZATION_VECTOR = _initializationVector();

export const disposable = workspace.onDidChangeConfiguration(function (event) {
    if (event.affectsConfiguration("ed-assistant.encryption.initializationVector")) {
        INITIALIZATION_VECTOR = _initializationVector(false);
    }
});
