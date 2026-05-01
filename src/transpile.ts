import transpile from '.';
import chalk from 'chalk';
import writeSettingsIni from './utils/writeSettingsIni';

console.log(chalk.blueBright("Running the transpiler's initial steps..."));

transpile().then(ct => {
    if (ct === -1) {
        console.log(chalk.red(chalk.bold('An error occurred.')));
        process.exit(1);
    }
    writeSettingsIni();
    console.log(chalk.green(chalk.bold('Successfully initialized plugin.')));
});
