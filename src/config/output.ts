import { ConfigurationTarget, workspace, WorkspaceConfiguration } from "vscode";

type OutputConfigurationKeys = "openToTheSide";

type OutputConfigurationType<T extends OutputConfigurationKeys> =
    T extends "openToTheSide" ? boolean : undefined;

interface OutputConfiguration extends WorkspaceConfiguration {
    get<T extends OutputConfigurationKeys>(section: T): OutputConfigurationType<T>;
    
    get<T extends OutputConfigurationKeys>(
        section: T,
        defaultValue: OutputConfigurationType<T>
    ): OutputConfigurationType<T>;
    
    has(section: OutputConfigurationKeys): boolean;
    
    update<T extends OutputConfigurationKeys>(
        section: T,
        value: OutputConfigurationType<T>,
        configurationTarget?: ConfigurationTarget | boolean | null,
        overrideInLanguage?: boolean
    ): Thenable<void>;
}

export default function (): OutputConfiguration {
    return workspace.getConfiguration("ed-assistant.output");
};
