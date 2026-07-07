import transpile from '.';
import chalk from 'chalk';
import writeSettingsIni from './utils/writeSettingsIni';
import logs from './logs/initialize';

console.log(chalk.blueBright("Running the transpiler's initial steps..."));

transpile().then(([ct, ua]) => {
    logs.finalize();
    if (ct === -1) {
        console.log(chalk.red(chalk.bold('An error occurred.')));
        process.exit(1);
    }
    logs.finalize();
    writeSettingsIni();
    console.log(chalk.green(chalk.bold('Successfully initialized plugin.')));
});
