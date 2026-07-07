import * as path from 'path';
import luaverConfig from './getConfig';

export default function getAbsolutePath(relPath: string) {
    const p = relPath.split('/');
    return path.join(process.cwd(), luaverConfig?.outDir ?? '/', ...p);
}
