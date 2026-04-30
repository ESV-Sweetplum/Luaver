import { LuaverConfigSchema } from '../interfaces/luaverConfig';
import luaverConfig from './getConfig';

export default function checkConfigValidity() {
    const missingParams: [string, string][] = [];
    const schema = LuaverConfigSchema;

    if (luaverConfig.sources.length === 1) missingParams.push(['sources', 'string[]']);

    Object.entries(schema).forEach(([k, t]) => {
        if (!(k in luaverConfig) && !t.includes('?')) {
            missingParams.push([k, t]);
        }
    });

    return missingParams;
}
