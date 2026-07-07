import * as fs from 'fs';
import getAbsolutePath from '../utils/getAbsolutePath';

let output: string[] = [];

const logs = {
    add: (msg: string) => output.push(msg),
    finalize: () => {
        const p = getAbsolutePath('Luaver/logs');
        fs.writeFileSync(p, output.join('\n'));
    },
    reset: () => (output = []),
};

export default logs;
