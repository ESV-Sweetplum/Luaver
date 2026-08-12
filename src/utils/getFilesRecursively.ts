import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';

export function getFilesRecursively(dir: string, includeWarning?: boolean) {
    let files: string[] = [];
    if (!fs.existsSync(dir)) {
        if (includeWarning)
            console.log(
                chalk.red(
                    `Warning: Source ${dir} does not exist. It will be skipped.`,
                ),
            );
        return [];
    }

    const filesInDirectory = fs.readdirSync(dir);
    for (const file of filesInDirectory) {
        const absolute = path.join(dir, file);
        if (fs.statSync(absolute).isDirectory()) {
            files = [...files, ...getFilesRecursively(absolute)];
        } else {
            files.push(absolute);
        }
    }

    return files;
}
