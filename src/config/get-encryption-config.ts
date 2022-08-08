import { ConfigurationTarget, workspace, WorkspaceConfiguration } from "vscode";

type EncryptionConfigurationKeys = "initializationVector" | "secretKey" | "algorithm";

type EncryptionConfigurationType<T extends EncryptionConfigurationKeys> =
    T extends "initializationVector" ? string | undefined :
    T extends "secretKey" ? string | undefined :
    T extends "algorithm" ? "aes-128-cbc" | "aes-128-ecb" :
    undefined;

interface EncryptionConfiguration extends WorkspaceConfiguration {
    get<T extends EncryptionConfigurationKeys>(section: T): EncryptionConfigurationType<T>;

    get<T extends EncryptionConfigurationKeys>(
        section: T,
        defaultValue: EncryptionConfigurationType<T>
    ): EncryptionConfigurationType<T>;

    has(section: EncryptionConfigurationKeys): boolean;

    update<T extends EncryptionConfigurationKeys>(
        section: T,
        value: EncryptionConfigurationType<T>,
        configurationTarget?: ConfigurationTarget | boolean | null,
        overrideInLanguage?: boolean
    ): Thenable<void>;
}

export default function (): EncryptionConfiguration {
    return workspace.getConfiguration("ed-assistant.encryption");
}
