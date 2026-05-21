import getAbsolutePath from './getAbsolutePath';
import luaverConfig from './getConfig';
import * as fs from 'fs';
import fileUnlocked from './fileUnlocked';

export default async function writeSettingsIni(forceVer?: boolean) {
    const settingsData = `
[Settings]
Name = ${luaverConfig.devVersionInPluginName || forceVer ? luaverConfig.pluginName + (luaverConfig.pluginVersion ? ' v' + luaverConfig.pluginVersion : '') : luaverConfig.pluginName}
Author = ${luaverConfig.pluginAuthor}
Description = ${luaverConfig.pluginDescription ?? 'No plugin description given.'}
`;

    const settingsPath = getAbsolutePath('settings.ini');
    const unlockAttempts = await fileUnlocked(settingsPath);

    fs.writeFileSync(settingsPath, settingsData.trim());
}
