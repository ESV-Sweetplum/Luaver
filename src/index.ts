import * as fs from 'fs';
import { getFilesRecursively } from './utils/getFilesRecursively';
import * as path from 'path';

const config = JSON.parse(fs.readFileSync('./luaverConfig.json', 'utf-8'));
const processors = getFilesRecursively('dist/processors');

async function processFile(file: string[]) {
    for (const processorPath of processors) {
        const processor = await import(
            path.join(__dirname, '..', processorPath)
        );
        const processorFunction = processor.default;
        if (processor.inputType === 'array') {
            file = processorFunction(file);
        } else if (processor.inputType === 'string') {
            file = processorFunction(file.join('\n')).split('\n');
        } else {
            throw new Error();
        }
    }

    return file;
}

processFile(['line 1', 'line 2']);
