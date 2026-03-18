import getProcessors from './utils/getProcessors';
import processLuaFile from './utils/processLuaFile';
import chalk from 'chalk';
import * as fs from 'fs';
import luaverConfig from './utils/getConfig';
import { getFilesRecursively } from './utils/getFilesRecursively';
import * as path from 'path';
import counters from './utils/getArbitraryCounter';
import getAndTrimFile from './utils/getAndTrimFile';
import getAbsolutePath from './utils/getAbsolutePath';

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

    if (entryPaths.length < entryPoints.length) {
        console.log(
            chalk.bgRedBright('LUAVER ERROR') +
                chalk.red(
                    ': You are missing one or more entry points. Please either add existing folders containing said entry points to your Luaver sources list, or create an entry point within an existing source.'
                )
        );
        console.log(
            chalk.redBright(
                `\nMissing: ${entryPoints
                    .filter((pt) => !entryPaths.some((f) => f.includes(pt)))
                    .map((n) => `_${n}.lua`)
                    .join(', ')}`
            )
        );
        process.exit(1);
    }

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

    let output = fileData.join(luaverConfig.lineSeparator);

    Object.entries(entryFileData).forEach(([entry, fileData]) => {
        output = `${output}${luaverConfig.lineSeparator}function ${entry}()${luaverConfig.lineSeparator}${fileData.join(luaverConfig.lineSeparator)}${luaverConfig.lineSeparator}end`;
    });

    output = processLuaFile(output, pluginProcessors);
    if (Array.isArray(output)) output = output.join(luaverConfig.lineSeparator);

    output = `PLUGIN_NAME="${luaverConfig.pluginName}";PLUGIN_VERSION="${luaverConfig.pluginVersion}";PLUGIN_AUTHOR="${luaverConfig.pluginAuthor}";PLUGIN_DESCRIPTION="${luaverConfig.pluginDescription}"${luaverConfig.lineSeparator}${output}`;
    if (luaverConfig.disableVectorPacking)
        output = `imgui_disable_vector_packing=true${luaverConfig.lineSeparator}${output}`;
    if (!luaverConfig.dontRandomizeSeed)
        output = `math.randomseed(os.time())${luaverConfig.lineSeparator}${output}`;

    if (fs.existsSync(getAbsolutePath('plugin.lua')))
        fs.rmSync(getAbsolutePath('plugin.lua'));
    fs.writeFileSync(getAbsolutePath('plugin.lua'), output);
    if (fs.existsSync('quinsight/intellisense.lua'))
        fs.copyFileSync(
            'quinsight/intellisense.lua',
            getAbsolutePath('intellisense.lua')
        );

    return paths.length;
}
