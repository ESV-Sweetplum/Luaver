import * as fs from 'fs';
import { getFilesRecursively } from './utils/getFilesRecursively';

const config = JSON.parse(fs.readFileSync('./luaverConfig.json', 'utf-8'));
const processors = getFilesRecursively('dist/processors');
async function processFile(file: string[]) {
    for (let p in processors) {
        const file = await import(p);
        // console.log(file);
    }
}

processFile([]);
