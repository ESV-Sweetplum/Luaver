# Luaver

Luaver is a framework designed to simplify plugin making in Quaver. It uses Node.js to automatically transform a multi-file, complex codebase into a single-file plugin ready for use. It comes built in with `imgui` wrappers, a fully-fledged routing system, and more features soon to come.

## Installation / Setup (temporary, will change soon)

1. Download the repository using the green `<> Code` button at the top right of the repository page
2. Drag the entire folder into your `Quaver/Plugins` folder
3. Add `settings.ini` to the folder, and set up your settings
4. Add `main.lua` to `src/pages`, with one function `main()`.
5. Open a CLI, and run `npm i` in the plugin's root folder.

## Usage

To get started, open VSCode and navigate to the desired plugin folder. Then, run `npm run watch` in the command line. This will start the watcher, which will transpile your code into plugin code each time you add, edit, or delete a file in the `src` directory. You can get started by editing the main page in `src/pages/main.lua`. To navigate to a different page, say in the file location `src/pages/foo/bar`, use `router.push("foo/bar")`, connectable to a button or any other input source. Plugin "pages" are done through the `src/pages` directory, and navigating to a page just means passing its path into `router.push()`.

## Future Features

- Automatic state management
- `imgui` inputs (Integer+, Float+, Text, Slider, Combo, Checkbox, RadioBoolean, etc.)
- Start and off offsets automatic computation (usage would be as a global variable)
- Built in finder functions, such as `get__InRange()` (would apply to hitobjects, timing points, scroll velocities, and bookmarks)
- Built in object generators: `sv(time, multiplier) => utils.CreateScrollVelocity(time, multiplier)`

## Special Thanks To:

- [IceDynamix](https://github.com/IceDynamix/) for the intellisense file.
- [Emik](https://github.com/Emik03) for the name.
