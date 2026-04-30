import * as json5 from 'json5';
import * as fs from 'fs';
import * as path from 'path';
import LuaverConfig from '../interfaces/luaverConfig';

export function reloadConfig() {
    if (!fs.existsSync('luaverConfig.json5')) return null as unknown as LuaverConfig;

    const config: LuaverConfig = json5.parse(fs.readFileSync('luaverConfig.json5', 'utf-8'));

    if (!config.sources || !Array.isArray(config.sources)) config.sources = [];
    if (!config.lineSeparator) config.lineSeparator = '\n';

    if (path.basename(process.cwd()) === 'Luaver') {
        config.sources.unshift('embedded');
    } else {
        config.sources.unshift('Luaver/embedded');
    }

    return config;
}

let luaverConfig: LuaverConfig = reloadConfig();

export default luaverConfig;
