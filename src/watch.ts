import * as chokidar from 'chokidar';
import chalk from 'chalk';
import { performance } from 'perf_hooks';
import luaverConfig, { reloadConfig } from './utils/getConfig';
import transpile from '.';
import writeSettingsIni from './utils/writeSettingsIni';
import './utils/logWrapped';
import logs from './logs/initialize';

let transpileLock = false;

const debounce = (fn: Function, ms = 300) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
};

chokidar.watch(luaverConfig?.sources ?? [], { ignoreInitial: true }).on(
    'all',
    debounce(
        (event: keyof chokidar.FSWatcherEventMap, path: string) =>
            main(event, path),
        250,
    ),
);

chokidar
    .watch('luaverConfig.json5', { ignoreInitial: true })
    .on('change', e => {
        console.logWrapped(
            chalk.bgRedBright(
                `\nChange detected on LuaverConfig. Please restart the watcher to apply these changes.`,
            ),
        );
        reloadConfig();
    });

async function main(event: keyof chokidar.FSWatcherEventMap, path: string) {
    if (transpileLock) {
        console.logWrapped(
            `\nEvent ${chalk.red(event)} detected on file ${chalk.red(path)}. The transpiler is currently busy and will retranspile in due time.`,
        );
    }
    const startTime = performance.now();
    console.logWrapped(
        `\nEvent ${chalk.red(event)} detected on file ${chalk.red(path)}. Now retranspiling...`,
    );
    transpileLock = true;

    const [fileCount, unlockAttempts] = await transpile();
    logs.finalize();
    const endTime = performance.now();
    transpileLock = false;
    if (fileCount === -1) return;
    console.logWrapped(
        `Successfully transpiled ${chalk.green(fileCount)} files in ${chalk.green(
            `${Math.round((endTime - startTime) * 1000) / 1000}ms`,
        )}.\n${unlockAttempts ? chalk.gray(`(required ${unlockAttempts} unlock attempt${unlockAttempts > 1 ? 's' : ''})`) : ''}`,
    );
}

transpile().then(([ct, att]) => {
    logs.finalize();
    if (ct === -1) {
        process.exit(1);
    }
    writeSettingsIni();
    console.logWrapped(
        chalk.blueBright(
            chalk.bold(
                'Watcher initialized and plugin transpiled. Make a change to a file to re-transpile.',
            ),
        ),
    );
});
