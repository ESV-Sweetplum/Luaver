import * as path from 'path';
import luaverConfig from './getConfig';

export default function getAbsolutePath(relPath: string) {
    // Initial ../.. is added to escape utils/dist folder into Luaver root.
    return path.join(process.cwd(), luaverConfig.outDir, relPath);
}
