import LuaProcessor from '../interfaces/luaProcessor';
import { getFilesRecursively } from './getFilesRecursively';
import * as path from 'path';

export async function getInternalProcessors(
    disableOptimizers?: boolean,
): Promise<LuaProcessor[]> {
    const processors = await getProcessors(
        'dist/_processors',
        (p: string) => disableOptimizers ?? p.includes('.bypass.'),
    );

    return processors;
}

export default async function getProcessors(
    p: string,
    filterFn?: (p: string) => boolean,
): Promise<LuaProcessor[]> {
    const processorPaths = getFilesRecursively(p);
    const processors: LuaProcessor[] = [];

    const requiredExtensions = ['.plugin.', '.file.'];

    for (const processorPath of processorPaths) {
        if (requiredExtensions.every(e => !processorPath.includes(e))) continue;
        if (filterFn && !filterFn(p)) continue;
        const processor: LuaProcessor = await import(
            path.join(__dirname, '../..', processorPath)
        );
        processor.context = processorPath.includes('.plugin.')
            ? 'plugin'
            : 'file';
        processors.push(processor);
    }

    return processors;
}
