import getProcessors from './utils/getProcessors';
import processLuaFile from './utils/processLuaFile';
import * as fs from 'fs';
const config = JSON.parse(fs.readFileSync('./luaverConfig.json', 'utf-8'));

async function main() {
    const processors = await getProcessors();
    const result = processLuaFile(
        fs
            .readFileSync('./plugin/_draw.lua', 'utf-8')
            .replaceAll(/(\r\n|\n)/g, config.lineSeparator),
        processors
    );

    console.log(result);
}

main();
