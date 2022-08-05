# Collection App Dev: Encryption Decryption Assistant

JSON objects encryption & decryption tool to the rescue of *Collections-App* developers toiling hard for days and nights.

## Features

### Read-only editor output

* Output for encryption & decryption are opened in a new readonly editor beside the active window.

## Usage

### Setup variables for the algorithm

1. Go to extension settings.
2. Set values for *Initialization Vector* and *Secret Key* before heading to other extension commands.

![Encrypt Text Demo](media/command-open-settings.gif)

### Encrypting JSON

1. Open up the *Command Palette*.
2. Locate the command by searching for the extension name.
3. Put the input in the input box and hit *Enter*.
    ![Encrypt Text Demo](media/command-encrypt-text.gif)
4. Or open any JSON document (saved or unsaved) and use the context menus as shown below.
![Editor Selection Context Menu](media/v0.0.6_editor_selection_menu.png)
![Editor Title Context Menu](media/v0.0.6_title_context_menu.png)
![Editor Title Menu](media/v0.0.6_title_menu.png)

### Decrypting Text

- Same steps as of *Encrypt JSON* command.

![alt](media/command-decrypt-text.gif)
