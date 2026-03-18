import * as fs from 'fs';
import luaverConfig from './getConfig';

export default function getAndTrimFile(path: string) {
    return fs
        .readFileSync(path, 'utf-8')
        .replaceAll(/(\r\n|\n)/g, luaverConfig.lineSeparator)
        .trim();
}
