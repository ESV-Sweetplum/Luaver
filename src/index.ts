import getProcessors from './utils/getProcessors';
import processLuaFile from './utils/processLuaFile';
import * as fs from 'fs';
import luaverConfig from './utils/getConfig';
import { getFilesRecursively } from './utils/getFilesRecursively';
import * as path from 'path';
import counters from './utils/getArbitraryCounter';
import getAndTrimFile from './utils/getAndTrimFile';

const entryPoints = ['draw', 'awake'];

export default async function transpile() {
    Object.keys(counters).forEach((key) => {
        counters[key] = 0;
    }); // Resets all counters to prevent strange file inconsistencies

    const processors = await getProcessors();
    const paths = luaverConfig.sources
        .map((source: string) =>
            getFilesRecursively(path.join(__dirname, '..', source))
        )
        .flat()
        .sort(
            (a: string, b: string) =>
                +b.includes('.priority.') - +a.includes('.priority.')
        );
    const [nonEntryPaths, entryPaths] = paths.reduce(
        ([a1, a2], path: string) => {
            (entryPoints.some(
                (e) => path.includes(`.${e}.`) || path.includes(`_${e}`)
            )
                ? a2
                : a1
            ).push(path);
            return [a1, a2];
        },
        [[], []]
    );

    const fileProcessors = processors.filter(
        (processor) => processor.context === 'file'
    );
    const pluginProcessors = processors.filter(
        (processor) => processor.context === 'plugin'
    );
    const fileData = nonEntryPaths.map((path: string) =>
        processLuaFile(getAndTrimFile(path), fileProcessors)
    );

    const entryFileData: Record<string, string[]> = entryPaths.reduce(
        (obj: Record<string, string[]>, path: string) => {
            if (!entryPoints.some((e) => path.includes(`_${e}`))) return obj;
            const key = path.split('_')[1].split('.lua')[0];
            const fileData = processLuaFile(
                getAndTrimFile(path),
                fileProcessors
            );
            obj[key] = Array.isArray(fileData)
                ? fileData
                : fileData.split(luaverConfig.lineSeparator);
            return obj;
        },
        {}
    );

    entryPaths.forEach((path: string) => {
        if (entryPoints.some((e) => path.includes(`_${e}`))) return;
        const key = path.split('.lua')[0].split('.').at(-1);
        const fileData = processLuaFile(getAndTrimFile(path), fileProcessors);

        entryFileData[key].push(
            ...(Array.isArray(fileData) ? fileData : fileData.split('\n'))
        );
    });

    let output = processLuaFile(
        fileData.join(luaverConfig.lineSeparator),
        pluginProcessors
    );

    if (Array.isArray(output)) output = output.join(luaverConfig.lineSeparator);
    Object.entries(entryFileData).forEach(([entry, fileData]) => {
        output = `${output}${luaverConfig.lineSeparator}function ${entry}()${luaverConfig.lineSeparator}${fileData.join(luaverConfig.lineSeparator)}${luaverConfig.lineSeparator}end`;
    });
    output = `PLUGIN_NAME="${luaverConfig.pluginName}";PLUGIN_VERSION="${luaverConfig.pluginVersion}";PLUGIN_AUTHOR="${luaverConfig.pluginAuthor}";PLUGIN_DESCRIPTION="${luaverConfig.pluginDescription}"${luaverConfig.lineSeparator}${output}`;
    if (luaverConfig.disableVectorPacking)
        output = `imgui_disable_vector_packing=true${luaverConfig.lineSeparator}${output}`;

    if (fs.existsSync(getAbsolutePath('plugin.lua')))
        fs.rmSync(getAbsolutePath('plugin.lua'));
    fs.writeFileSync(path.join(getAbsolutePath('plugin.lua')), output);
    if (fs.existsSync('quinsight/intellisense.lua'))
        fs.copyFileSync(
            'quinsight/intellisense.lua',
            getAbsolutePath('intellisense.lua')
        );

    return paths.length;
}

function getAbsolutePath(relPath: string) {
    // Initial .. is added to escape dist folder into Luaver root.
    return path.join(__dirname, '..', luaverConfig.outDir, relPath);
}
