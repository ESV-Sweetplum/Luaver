import * as fs from 'fs';
import getAbsolutePath from '../utils/getAbsolutePath';

let output: string[] = [];

const logs = {
    add: (msg: string) => output.push(msg),
    finalize: () => {
        const latestPath = getAbsolutePath(`Luaver/logs/latest.log`);
        fs.writeFileSync(latestPath, output.join('\n'));
    },
    reset: () => (output = []),
};

export default logs;
