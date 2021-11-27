import { commands, window, workspace } from "vscode";

function _initializationVector(showAlert = false): string {
    const value = workspace
        .getConfiguration("ed-assistant.encryption")
        .get<string>("initializationVector");
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

function _secretKey(showAlert = true): string {
    const value = workspace
        .getConfiguration("ed-assistant.encryption")
        .get<string>("secretKey");
    if (showAlert && !value) {
        window
            .showWarningMessage(
                "Secret key not set in extension settings. Extension may output errors.",
                "Set key"
            )
            .then(function () {
                commands.executeCommand(
                    "workbench.action.openSettings",
                    "ed-assistant.encryption.secretKey"
                );
            });
    }
    return value || "";
}

export let SECRET_KEY = _secretKey();

export const disposable = workspace.onDidChangeConfiguration(function (event) {
    if (event.affectsConfiguration("ed-assistant.encryption.initializationVector")) {
        INITIALIZATION_VECTOR = _initializationVector();
    }
    if (event.affectsConfiguration("ed-assistant.encryption.secretKey")) {
        SECRET_KEY = _secretKey();
    }
});
