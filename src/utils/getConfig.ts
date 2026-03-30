import * as json5 from 'json5';
import * as fs from 'fs';
import * as path from 'path';
import LuaverConfig from '../interfaces/luaverConfig';

export function reloadConfig() {
    const config: LuaverConfig = json5.parse(
        fs.readFileSync('luaverConfig.json5', 'utf-8'),
    );

    if (path.basename(process.cwd()) === 'Luaver') {
        config.sources.unshift('embedded');
    } else {
        config.sources.unshift('Luaver/embedded');
    }

    return config;
}

let luaverConfig: LuaverConfig = reloadConfig();

export default luaverConfig;
