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
import checkConfigValidity from './utils/checkConfigValidity';
import { getInternalProcessors } from './utils/getProcessors';

const entryPoints = ['draw', 'awake'];

export default async function transpile(options: Partial<TranspilerOptions> = {}) {
    const missingConfigParams = checkConfigValidity();

    if (missingConfigParams.length) {
        await printLuaverError(
            `You are missing one or more configuration parameters in your Luaver Config. Please add them to build the project.\n\nMissing: ${missingConfigParams.map(([k, t]) => `${k} (${t})`).join('\n         ')}`,
        );

        return -1;
    }

    let cancellation = {
        execute: false,
        reason: '',
    };

    Object.keys(counters).forEach(key => {
        counters[key] = 0;
    }); // Resets all counters to prevent strange file inconsistencies

    const processors = luaverConfig.disableDefaultProcessors ? [] : await getInternalProcessors();
    const paths = luaverConfig.sources
        .map((source: string) =>
            getFilesRecursively(path.join(__dirname, '..', source)).sort(
                (a: string, b: string) => +b.includes('.priority.') - +a.includes('.priority.'),
            ),
        )
        .flat()
        .filter((f: string) => f.endsWith('.lua') && !f.includes('intellisense'));

    const [nonEntryPaths, entryPaths] = paths.reduce(
        ([a1, a2]: [string[], string[]], path) => {
            (entryPoints.some(e => path.includes(`.${e}.`) || path.includes(`_${e}`)) ? a2 : a1).push(path);
            return [a1, a2];
        },
        [[], []],
    );

    if (entryPaths.length < entryPoints.length) {
        await printLuaverError(
            `You are missing one or more entry points. Please either add existing folders containing said entry points to your Luaver sources list, or create an entry point within an existing source.\n\nMissing: ${entryPoints
                .filter(pt => !entryPaths.some(f => f.includes(pt)))
                .map(n => `_${n}.lua`)
                .join(', ')}`,
        );

        return -1;
    }

    const fileProcessors = processors.filter(processor => processor.context === 'file');
    const pluginProcessors = processors.filter(processor => processor.context === 'plugin');
    const fileData = nonEntryPaths.map((path: string) => processLuaFile(getAndTrimFile(path), fileProcessors));

    const entryFileData: Record<string, string[]> = entryPaths.reduce((obj: Record<string, string[]>, path: string) => {
        if (!entryPoints.some(e => path.includes(`_${e}`))) return obj;
        const key = path.split('_')[1].split('.lua')[0];
        const fileData = processLuaFile(getAndTrimFile(path), fileProcessors);
        obj[key] = Array.isArray(fileData) ? fileData : fileData.split(luaverConfig.lineSeparator);

        const fnDefLine = obj[key].findIndex(line => line.includes(`function ${key}()`));
        if (fnDefLine !== -1) {
            obj[key].splice(fnDefLine);
            const lastEndLine = obj[key].findLastIndex(line => /\s*end\s*/.test(line));
            if (lastEndLine === -1) {
                cancellation.execute = true;
                cancellation.reason = `Could not find a corresponding "end" to remove from the ${key} entry point. Consider removing the "${key}" function definition and having Luaver handle it automatically.`;
            }
        }
        return obj;
    }, {});

    entryPaths.forEach((path: string) => {
        if (entryPoints.some(e => path.includes(`_${e}`))) return;
        const terms = path.split('.lua')[0].split('.');
        const key = terms.at(-1) as string;
        const fileData = processLuaFile(getAndTrimFile(path), fileProcessors);
        const insertionInfo = Array.isArray(fileData) ? fileData : fileData.split('\n');

        if (path.includes('.precurse.')) {
            entryFileData[key].unshift(...insertionInfo);
        } else {
            entryFileData[key].push(...insertionInfo);
        }
    });

    let output: string | string[] = fileData.join(luaverConfig.lineSeparator);

    Object.entries(entryFileData).forEach(([entry, fileData]) => {
        output = `${output}${luaverConfig.lineSeparator}function ${entry}()${luaverConfig.lineSeparator}${fileData.join(luaverConfig.lineSeparator)}${luaverConfig.lineSeparator}end`;
    });

    output = processLuaFile(output, pluginProcessors);
    if (Array.isArray(output)) output = output.join(luaverConfig.lineSeparator);

    output = `imgui_disable_vector_packing=true${luaverConfig.lineSeparator}PLUGIN_NAME="${luaverConfig.pluginName}";${luaverConfig.pluginVersion ? `PLUGIN_VERSION="${luaverConfig.pluginVersion};"` : ''}PLUGIN_AUTHOR="${luaverConfig.pluginAuthor}";PLUGIN_DESCRIPTION="${luaverConfig.pluginDescription ?? 'No plugin description given.'}"${luaverConfig.lineSeparator}ENVIRONMENT="${options.environment ?? 'development'}";DISTRO="${options.distro ?? 'development'}"${luaverConfig.lineSeparator}${output}`;
    if (!luaverConfig.dontRandomizeSeed) output = `math.randomseed(os.time())${luaverConfig.lineSeparator}${output}`;

    output = `-- [${luaverConfig.pluginName}${luaverConfig.pluginVersion ? ` ${luaverConfig.pluginVersion}` : ''}] (Compiled by Luaver)${luaverConfig.lineSeparator}-- DO NOT EDIT THIS FILE DIRECTLY.${luaverConfig.lineSeparator.repeat(2)}${output}`;

    if (cancellation.execute) {
        await printLuaverError(cancellation.reason);
        return -1;
    }

    fs.writeFileSync(getAbsolutePath(options.destination ?? 'plugin.lua'), output);

    const quinsightStr = path.basename(process.cwd()) === 'Luaver' ? 'quinsight' : `Luaver${path.sep}quinsight`;

    const intellisensePath = path.join(quinsightStr, 'intellisense.lua');
    if (fs.existsSync(intellisensePath)) fs.copyFileSync(intellisensePath, getAbsolutePath('intellisense.lua'));

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
