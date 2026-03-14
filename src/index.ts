import getProcessors from './utils/getProcessors';
import processLuaFile from './utils/processLuaFile';
import * as fs from 'fs';
import luaverConfig from './utils/getConfig';

async function main() {
    const processors = await getProcessors();
    const result = processLuaFile(
        fs
            .readFileSync('./plugin/_draw.lua', 'utf-8')
            .replaceAll(/(\r\n|\n)/g, luaverConfig.lineSeparator),
        processors
    );

    console.log(result);
}

main();
