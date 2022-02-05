### Customize Background for VSCode!

Custom backgrounds for languages in vscode. Quick Demonstration:

![VSCode Customizer in action](./vscode-customizer.gif)

This extension runs on the vscode custom-css extension.

https://github.com/be5invis/vscode-custom-css


### Installation

1. Download and install the Custom CSS and JS Loader extension from the official link: https://marketplace.visualstudio.com/items?itemName=be5invis.vscode-custom-css
2. Download VSCode Customizer [here](https://github.com/HopefulLlama/vscode-customizer/blob/main/main.js)
3. Add this code to your settings.json (<kbd>Ctrl</kbd>+<kbd>P</kbd> -> Open Settings (JSON))
```javascript
"vscode_custom_css.imports": [
        "file:///D:/path/to/main.js",
],
```
4. Don't forget to insert your own path to the `main.js` file on your computer
5. Run VSCode with Admin priviliges
6. <kbd>Ctrl</kbd>+<kbd>P</kbd> -> Reload Custom CSS and JS, click Restart

It should work now! If it doesn't try to bugfix the Custom CSS JS loader extension.

### Configuration

Options

| Property Name                      | Data Type                  | Default Value          | Description                                                      | Example                     |
|---|---|---|---|---|
| `config.<editor-type>.style`       | String                     | `""`                   | A CSS string to apply to the background.                         | `"color: red"`              |
| `config.<editor-type>.callback`    | (div: HtmlElement) => void | `() => {}`             | A callback to allow programmatic manipulation of the background. | `(div) => console.log(div)` |
| `observe.interval`                 | Number                     | 100                    | How often, in milliseconds, to check for an editor change.       | `100`                       |
| `observe.timeout`                  | Number                     | 3000                   | How long, in milliseconds, to wait for an editor change.         | `3000`                      |
| `mode`                             | String                     | `"fullscreen_notitle"` | The type of background to apply.                                 | `"fullscreen_notitle"`      |


`<editor-type>` in the `config` block should be one of:
* `all`
* `default`
* `plaintext`
* `javascript`
* `json`
* `jsonc`
* `html`
* `css`

While other types of Editor Types supported by VS Code should work here, it will not have default styling.

`mode` should be one of:
* `fullscreen`
* `fullscreen_notitle`
* `editor`
* `editor_extended`
* `panel`
* `sidebar`
* `sidebar_extended`

After configuring reload the JS again. (<kbd>Ctrl</kbd>+<kbd>P</kbd> -> Reload Custom CSS and JS, click Restart)

### Finally
Finally, have fun! The possibilities for theming are endless and your imagination is the only border!
If you have a nice combination you can gladly showcase it!

