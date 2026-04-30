import { checkConfigViolation } from './checkConfigValidity';
import chalk from 'chalk';

const violations = checkConfigViolation();

violations.forEach(v => {
    if (v.type === 'Missing') return;
    console.log(
        chalk.bgRedBright(chalk.black('CONFIG VIOLATION:')) +
            chalk.red(` ${chalk.bold(v.key)} failed a type test: ${v.message}`),
    );
});

if (violations.length) console.log(chalk.red('The current script may not run as usual.'));
