import * as fs from 'fs';
import getAbsolutePath from '../utils/getAbsolutePath';
import luaverConfig from '../utils/getConfig';
import chalk from 'chalk';

let output: string[] = [];

const logs = {
    add: (msg: string) => output.push(msg),
    finalize: () => {
        const logFolder = getAbsolutePath('logs');
        if (!fs.existsSync(logFolder)) fs.mkdirSync(logFolder);
        const curPath = getAbsolutePath(
            `logs/${new Date().toISOString().replaceAll(':', ',')}.log`,
        );
        const latestPath = getAbsolutePath(`logs/latest.log`);
        fs.writeFileSync(curPath, output.join('\n'));
        fs.writeFileSync(latestPath, output.join('\n'));

        fs.readdirSync(logFolder).forEach(f => {
            if (f.includes('latest.log')) return;
            const creationTime = Date.parse(f.replaceAll(',', ':'));
            const rn = Date.now();
            if (rn - creationTime > 2.592e8) {
                fs.rmSync(f);
            }
        });
        const gitignore = fs
            .readFileSync(getAbsolutePath('.gitignore'), 'utf-8')
            .split(luaverConfig?.lineSeparator ?? '\n');
        if (!gitignore.every(p => p.includes('logs'))) {
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
