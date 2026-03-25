import getAbsolutePath from './getAbsolutePath';
import luaverConfig from './getConfig';
import * as fs from 'fs';

export default function writeSettingsIni() {
    const settingsData = `
[Settings]
Name = ${luaverConfig.includeVersionInPluginName ? luaverConfig.pluginName + ' v' + luaverConfig.pluginVersion : luaverConfig.pluginName}
Author = ${luaverConfig.pluginAuthor}
Description = ${luaverConfig.pluginDescription}
`;

    if (fs.existsSync(getAbsolutePath('settings.ini')))
        fs.rmSync(getAbsolutePath('settings.ini'));

    fs.writeFileSync(getAbsolutePath('settings.ini'), settingsData);
}
