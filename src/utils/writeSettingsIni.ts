import getAbsolutePath from './getAbsolutePath';
import luaverConfig from './getConfig';
import * as fs from 'fs';

export default function writeSettingsIni(forceVer?: boolean) {
    const settingsData = `
[Settings]
Name = ${luaverConfig.includeVersionInPluginName || forceVer ? luaverConfig.pluginName + ' v' + luaverConfig.pluginVersion : luaverConfig.pluginName}
Author = ${luaverConfig.pluginAuthor}
Description = ${luaverConfig.pluginDescription}
`;

    fs.writeFileSync(getAbsolutePath('settings.ini'), settingsData);
}
