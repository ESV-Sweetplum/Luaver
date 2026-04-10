import { Chunk } from 'luaparse';
import LuaverConfig from './luaverConfig';

interface LuaProcessor {
    default: <T extends string | string[] | Chunk>(file: T, config: LuaverConfig) => T;
    context: 'file' | 'plugin';
}

export default LuaProcessor;
