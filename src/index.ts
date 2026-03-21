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
import TranspilerOptions from './interfaces/transpilerOptions';

const entryPoints = ['draw', 'awake'];

export default async function transpile(
    options: Partial<TranspilerOptions> = {}
) {
    let cancellation = {
        execute: false,
        reason: ''
    };

    Object.keys(counters).forEach((key) => {
        counters[key] = 0;
    }); // Resets all counters to prevent strange file inconsistencies

    const processors = await getProcessors();
    const paths = luaverConfig.sources
        .map((source: string) =>
            getFilesRecursively(path.join(__dirname, '..', source)).sort(
                (a: string, b: string) =>
                    +b.includes('.priority.') - +a.includes('.priority.')
            )
        )
        .flat();

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
        printLuaverError(
            `You are missing one or more entry points. Please either add existing folders containing said entry points to your Luaver sources list, or create an entry point within an existing source.\n\nMissing: ${entryPoints
                .filter((pt) => !entryPaths.some((f) => f.includes(pt)))
                .map((n) => `_${n}.lua`)
                .join(', ')}`
        );

        return -1;
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

            const fnDefLine = obj[key].findIndex((line) =>
                line.includes(`function ${key}()`)
            );
            if (fnDefLine !== -1) {
                obj[key].splice(fnDefLine);
                const lastEndLine = obj[key].findLastIndex((line) =>
                    /\s*end\s*/.test(line)
                );
                if (lastEndLine === -1) {
                    cancellation.execute = true;
                    cancellation.reason = `Could not find a corresponding "end" to remove from the ${key} entry point. Consider removing the "${key}" function definition and having Luaver handle it automatically.`;
                }
            }
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

    output = `PLUGIN_NAME="${luaverConfig.pluginName}";PLUGIN_VERSION="${luaverConfig.pluginVersion}";PLUGIN_AUTHOR="${luaverConfig.pluginAuthor}";PLUGIN_DESCRIPTION="${luaverConfig.pluginDescription}"${luaverConfig.lineSeparator}ENVIRONMENT="${options.environment ?? 'development'}";DISTRO="${options.distro ?? 'development'}"${luaverConfig.lineSeparator}${output}`;
    if (luaverConfig.disableVectorPacking)
        output = `imgui_disable_vector_packing=true${luaverConfig.lineSeparator}${output}`;
    if (!luaverConfig.dontRandomizeSeed)
        output = `math.randomseed(os.time())${luaverConfig.lineSeparator}${output}`;

    if (cancellation.execute) {
        printLuaverError(cancellation.reason);
        return -1;
    }

    if (fs.existsSync(getAbsolutePath('plugin.lua')))
        fs.rmSync(getAbsolutePath('plugin.lua'));
    fs.writeFileSync(getAbsolutePath('plugin.lua'), output);

    const intellisensePath = luaverConfig.disableVectorPacking
        ? 'quinsight/intellisense.lua'
        : 'quinsight/intellisensePacked.lua';
    if (fs.existsSync(intellisensePath))
        fs.copyFileSync(intellisensePath, getAbsolutePath('intellisense.lua'));

    return paths.length;
}

export async function printLuaverError(msg: string) {
    renderBigLine(1);
    console.error(chalk.bgRedBright('LUAVER ERROR') + chalk.red(' ' + msg));
    renderBigLine(2);
}

export function renderBigLine(type: 0 | 1 | 2) {
    if (type === 1) console.log();
    console.log('─'.repeat(process.stdout.columns));
    if (type === 2) console.log();
}
