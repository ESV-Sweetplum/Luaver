import LuaProcessor from '../interfaces/luaProcessor';
import luaverConfig from './getConfig';

export default function processLuaFile(file: string | string[], processors: LuaProcessor[]) {
    for (const processor of processors) {
        if (typeof file === 'string') file = file.split(luaverConfig.lineSeparator);
        const processorFunction = processor.default;
        file = processorFunction(file, luaverConfig);
    }

    return file;
}
