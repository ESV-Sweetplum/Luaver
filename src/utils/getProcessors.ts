import LuaProcessor from '../interfaces/luaProcessor';
import { getFilesRecursively } from './getFilesRecursively';
import * as path from 'path';

export default async function getProcessors(): Promise<LuaProcessor[]> {
    const processorPaths = getFilesRecursively('dist/_processors');
    const processors: LuaProcessor[] = [];

    for (const processorPath of processorPaths) {
        const processor: LuaProcessor = await import(
            path.join(__dirname, '../..', processorPath)
        );
        processors.push(processor);
    }

    return processors;
}
