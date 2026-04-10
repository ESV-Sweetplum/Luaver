import AdmZip = require('adm-zip');
import transpiler from '.';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import luaverConfig from './utils/getConfig';
import getAbsolutePath from './utils/getAbsolutePath';
import writeSettingsIni from './utils/writeSettingsIni';

export default async function build() {
    const startTime = Date.now();

    console.log(
        chalk.blueBright(
            chalk.bold(
                `Transpiling ${chalk.redBright('plugin.lua')} in the ${chalk.redBright('GitHub')} context...`,
            ),
        ),
    );

    const fileCount1 = await transpiler({
        distro: 'github',
        environment: 'production',
    });
    const pluginGithub = fs.readFileSync(
        getAbsolutePath('plugin.lua'),
        'utf-8',
    );

    console.log(
        chalk.blueBright(
            chalk.bold(
                `Internally saved ${chalk.redBright('GitHub/plugin.lua')}.`,
            ),
        ),
    );

    console.log(
        chalk.blueBright(
            chalk.bold(
                `Transpiling ${chalk.redBright('plugin.lua')} in the ${chalk.redBright('Steam')} context...`,
            ),
        ),
    );

    const fileCount2 = await transpiler({
        distro: 'steam',
        environment: 'production',
    });
    const pluginSteam = fs.readFileSync(getAbsolutePath('plugin.lua'), 'utf-8');

    console.log(
        chalk.blueBright(
            chalk.bold(
                `Internally saved ${chalk.redBright('Steam/plugin.lua')}.`,
            ),
        ),
    );

    console.log(
        chalk.blueBright(
            chalk.bold(`Recompiling ${chalk.redBright('settings.ini')}...`),
        ),
    );

    writeSettingsIni(luaverConfig.buildVersionInPluginName);

    const packageName = `${luaverConfig.pluginName}-${luaverConfig.pluginVersion}`;
    console.log(
        chalk.blueBright(
            chalk.bold(
                `Zipping into ${chalk.redBright(`builds/${packageName}`)}...`,
            ),
        ),
    );

    const zip = new AdmZip();
    try {
        const buildPath = getAbsolutePath('builds');
        const tempGithubPath = getAbsolutePath('temp-build-github');
        const tempSteamPath = getAbsolutePath('temp-build-steam');
        const settingsIniPath = getAbsolutePath('settings.ini');
        if (!fs.existsSync(tempGithubPath)) fs.mkdirSync(tempGithubPath);
        if (!fs.existsSync(tempSteamPath)) fs.mkdirSync(tempSteamPath);
        fs.mkdirSync(path.join(tempGithubPath, packageName));
        fs.mkdirSync(path.join(tempSteamPath, packageName));

        fs.writeFileSync(
            path.join(tempGithubPath, packageName, 'plugin.lua'),
            pluginGithub,
        );
        fs.writeFileSync(
            path.join(tempSteamPath, packageName, 'plugin.lua'),
            pluginSteam,
        );
        fs.copyFileSync(
            settingsIniPath,
            path.join(tempGithubPath, packageName, 'settings.ini'),
        );
        fs.copyFileSync(
            settingsIniPath,
            path.join(tempSteamPath, packageName, 'settings.ini'),
        );

        console.log(
            chalk.blueBright(
                chalk.bold(
                    `Added ${chalk.redBright('plugin.lua')} and ${chalk.redBright('settings.ini')} to both folders.`,
                ),
            ),
        );

        if (luaverConfig.workshopFolder) {
            const workshopPath = getAbsolutePath(luaverConfig.workshopFolder);

            if (fs.existsSync(workshopPath)) {
                if (
                    fs.existsSync(
                        path.join(workshopPath, 'steam_workshop_id.txt'),
                    )
                ) {
                    fs.copyFileSync(
                        path.join(workshopPath, 'steam_workshop_id.txt'),
                        path.join(
                            tempSteamPath,
                            packageName,
                            'steam_workshop_id.txt',
                        ),
                    );
                }
                if (
                    fs.existsSync(
                        path.join(workshopPath, 'steam_workshop_preview.png'),
                    )
                ) {
                    fs.copyFileSync(
                        path.join(workshopPath, 'steam_workshop_preview.png'),
                        path.join(
                            tempSteamPath,
                            packageName,
                            'steam_workshop_preview.png',
                        ),
                    );
                }
            } else {
                console.log(
                    chalk.blueBright(
                        chalk.bold(
                            `The listed workshop folder ${chalk.redBright(luaverConfig.workshopFolder)} does not exist.`,
                        ),
                    ),
                );
            }
        } else {
            console.log(
                chalk.blueBright(
                    chalk.bold(
                        `No workshop folder was listed in ${chalk.redBright('luaverConfig.json5')}. The steam output folder will be equivalent to the unzipped GitHub folder.`,
                    ),
                ),
            );
        }

        zip.addLocalFolder(tempGithubPath);
        zip.writeZip(path.join(buildPath, `${packageName}.zip`));

        fs.cpSync(
            path.join(tempSteamPath, packageName),
            path.join(buildPath, `${packageName}-steam`),
            {
                recursive: true,
                force: true,
            },
        );

        console.log(
            chalk.greenBright(
                chalk.bold(
                    `Process completed in ${Date.now() - startTime}ms. Find the build at ${chalk.redBright(
                        `builds/${packageName}`,
                    )}.`,
                ),
            ),
        );

        fs.rmSync('temp-build-github', { recursive: true, force: true });
        fs.rmSync('temp-build-steam', { recursive: true, force: true });
    } catch (e) {
        console.log(
            chalk.bgRedBright(
                `An error occurred during the build process: ${e}`,
            ),
        );

        fs.rmSync('temp-build-github', { recursive: true, force: true });
        fs.rmSync('temp-build-steam', { recursive: true, force: true });
    }

    // Undoes any changes done by the build process.
    transpiler();
}

build();
