import * as fs from 'fs';
import getAbsolutePath from '../utils/getAbsolutePath';

let output: string[] = [];

const logs = {
    add: (msg: string) => output.push(msg),
    finalize: () => {
        const logFolder = getAbsolutePath('logs');
        if (!fs.existsSync(logFolder)) fs.mkdirSync(logFolder);
        const curPath = getAbsolutePath(
            `${logFolder}/${new Date().toString()}`,
        );
        const latestPath = getAbsolutePath(`${logFolder}/latest.log`);
        fs.writeFileSync(curPath, output.join('\n'));
        fs.writeFileSync(latestPath, output.join('\n'));

        fs.readdirSync(logFolder).forEach(f => {
            if (f.includes('latest.log')) return;
            const creationTime = Date.parse(f);
            const rn = Date.now();
            if (rn - creationTime > 2.592e8) {
                fs.rmSync(f);
            }
        });
    },
    reset: () => (output = []),
};

export default logs;
