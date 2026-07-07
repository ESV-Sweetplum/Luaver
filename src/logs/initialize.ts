import * as fs from 'fs';
import * as path from 'path';
import getAbsolutePath from '../utils/getAbsolutePath';
import luaverConfig from '../utils/getConfig';
import chalk from 'chalk';

let output: string[] = [];

const logs = {
    add: (msg: string) => output.push(msg),
    finalize: () => {
        output.push('\n--- OUTPUT ENDED. ---');

        const logFolder = getAbsolutePath('logs');
        if (!fs.existsSync(logFolder)) fs.mkdirSync(logFolder);
        const curPath = getAbsolutePath(
            `logs/${new Date().toISOString().replaceAll(':', ',')}.log`,
        );
        const latestPath = getAbsolutePath(`logs/latest.log`);

        fs.readdirSync(logFolder).forEach(f => {
            if (f.includes('latest.log')) return;
            const creationTime = new Date(
                f.replace('.log', '').replaceAll(',', ':'),
            ).getTime();
            const rn = Date.now();
            const expiryTime = 24 * 60 * 60 * 1000; // 1 day
            if (rn - creationTime > expiryTime) {
                fs.rmSync(path.join(logFolder, f));
            }
        });

        fs.writeFileSync(curPath, output.join('\n'));
        fs.writeFileSync(latestPath, output.join('\n'));

        const gitignore = fs
            .readFileSync(getAbsolutePath('.gitignore'), 'utf-8')
            .split(luaverConfig?.lineSeparator ?? '\n');
        if (!gitignore.some(p => p.includes('logs'))) {
            console.log(
                chalk.red(
                    'Please add the "logs" folder to your .gitignore file.',
                ),
            );
        }
    },
    reset: () => (output = []),
};

export default logs;
