import getAbsolutePath from './getAbsolutePath';
import luaverConfig from './getConfig';
import * as fs from 'fs';

export default function writeSettingsIni(forceVer?: boolean) {
    const settingsData = `
[Settings]
Name = ${luaverConfig.devVersionInPluginName || forceVer ? luaverConfig.pluginName + (luaverConfig.pluginVersion ? ' v' + luaverConfig.pluginVersion : '') : luaverConfig.pluginName}
Author = ${luaverConfig.pluginAuthor}
Description = ${luaverConfig.pluginDescription ?? 'No plugin description given.'}
`;

    fs.writeFileSync(getAbsolutePath('settings.ini'), settingsData.trim());
}
