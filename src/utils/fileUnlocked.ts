import * as fs from 'fs';

export default async function fileUnlocked(
    path: string,
    interval: number = 500,
    timeout: number = 30000,
) {
    const startTime = Date.now();
    let currentTime = startTime;
    let attempts = 0;
    while (currentTime < startTime + timeout) {
        try {
            const f = await fs.promises.open(path, 'r+');
            await f.close();
            return attempts;
        } catch (e) {
            currentTime = Date.now();
            await new Promise(r => setTimeout(r, interval));
            attempts++;
        }
    }

    return -1;
}
