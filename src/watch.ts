import * as chokidar from 'chokidar';
import chalk from 'chalk';
import { performance } from 'perf_hooks';
import luaverConfig, { reobtainConfig } from './utils/getConfig';
import transpile from '.';
import * as fs from 'fs';
import getAbsolutePath from './utils/getAbsolutePath';
import * as path from 'path';
import writeSettingsIni from './utils/writeSettingsIni';

const debounce = (fn: Function, ms = 300) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
};

chokidar.watch(luaverConfig.sources, { ignoreInitial: true }).on(
    'all',
    debounce(
        (event: keyof chokidar.FSWatcherEventMap, path: string) =>
            main(event, path),
        100,
    ),
);

chokidar
    .watch('./luaverConfig.json5', { ignoreInitial: true })
    .on('change', e => {
        console.log(
            chalk.bgRedBright(
                `\nChange detected on LuaverConfig. Please restart the watcher to apply these changes.`,
            ),
        );
        reobtainConfig();
    });

async function main(event: keyof chokidar.FSWatcherEventMap, path: string) {
    const startTime = performance.now();
    console.log(
        `\nEvent ${chalk.red(event)} detected on file ${chalk.red(path)}. Now retranspiling...`,
    );

    const fileCount = await transpile();
    const endTime = performance.now();
    if (fileCount === -1) return;
    console.log(
        `Successfully transpiled ${chalk.green(fileCount)} files in ${chalk.green(
            `${Math.round((endTime - startTime) * 1000) / 1000}ms`,
        )}.\n`,
    );
}

transpile().then(ct => {
    if (ct === -1) return;
    console.log(
        chalk.blueBright(
            chalk.bold(
                'Watcher initialized and plugin transpiled. Make a change to a file to re-transpile.',
            ),
        ),
    );
});

writeSettingsIni();
