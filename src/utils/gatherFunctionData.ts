import * as path from 'path';
import luaverConfig from './getConfig';

export const functionData: Record<string, string[]> = {};

export default function gatherFunctionData(p: string, str: string) {
    if (p.includes(path.join('Luaver', 'embedded'))) return str;

    const splitStr = str
        .split(luaverConfig.lineSeparator)
        .filter(l => !l.startsWith('--'));

    if (!splitStr[0].startsWith('function')) return str;
    if (splitStr[splitStr.length - 1] !== 'end') return str;

    const functionName = splitStr[0].slice(9).split('(')[0];
    const relPath = path.join(path.relative(process.cwd(), p), '..');
    if (!functionData[relPath]) functionData[relPath] = [];
    functionData[relPath].push(functionName);

    return str;
}
