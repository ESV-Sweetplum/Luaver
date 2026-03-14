import * as fs from 'fs';
import LuaProcessor from '../interfaces/luaProcessor';

const config = JSON.parse(fs.readFileSync('./luaverConfig.json', 'utf-8'));

export default function processLuaFile(
    file: string | string[],
    processors: LuaProcessor[]
) {
    for (const processor of processors) {
        if (typeof file === 'string') file = file.split(config.lineSeparator);
        const processorFunction = processor.default;
        file = processorFunction(file, config);
    }

    return file;
}
