import * as fs from 'fs';
import logs from '../logs/initialize';

export default async function fileUnlocked(
    path: string,
    interval: number = 500,
    timeout: number = 30000,
    log: boolean = true,
) {
    const startTime = Date.now();
    let currentTime = startTime;
    let attempts = 0;
    if (!fs.existsSync(path)) return attempts;
    while (currentTime < startTime + timeout) {
        try {
            const f = await fs.promises.open(path, 'r+');
            await f.close();
            return attempts;
        } catch (e) {
            currentTime = Date.now();
            if (log) logs.add(`Unlock attempt failed. Error message:\n${e}`);

            await new Promise(r => setTimeout(r, interval));
            attempts++;
        }
    }

    return -1;
}
