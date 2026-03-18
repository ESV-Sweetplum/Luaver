import * as json5 from 'json5';
import * as fs from 'fs';
import LuaverConfig from '../interfaces/luaverConfig';

let luaverConfig: LuaverConfig;

export function reobtainConfig() {
    luaverConfig = json5.parse(
        fs.readFileSync('./luaverConfig.json5', 'utf-8')
    );
}

reobtainConfig();

export default luaverConfig;
