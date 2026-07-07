import LuaverConfig from '../interfaces/luaverConfig';
import acBuilder from 'ahocorasick';
import getFunctionList from '../utils/getFunctionList';
import { writeFileSync } from 'fs';
import logs from '../logs/initialize';

export default function LintUnusedFunctions(
    input: string[],
    config: LuaverConfig,
) {
    let linted = false;
    let iterationCount = 0;
    let joinedInput = `${config.lineSeparator}${input.join(config.lineSeparator)}${config.lineSeparator}`;

    while (!linted && iterationCount < 10) {
        iterationCount++;
        linted = true;

        let functions = getFunctionList(input).filter(
            name =>
                !name.startsWith('string') &&
                !name.startsWith('table') &&
                !['awake', 'draw'].includes(name),
        );

        const ac = new acBuilder(
            functions
                .map(fn => [
                    `${fn}(`,
                    `${fn},`,
                    `${fn})`,
                    `= ${fn}`,
                    `${fn} {`,
                    `${fn}{`,
                ])
                .flat(),
        );
        const acResult = ac
            .search(joinedInput)
            .reduce((obj: Record<string, number[]>, arr) => {
                const target = arr[1][0].replaceAll(/([\(,\)\{\} ]|= )/g, '');
                if (obj[target]) {
                    obj[target].push(arr[0]);
                } else {
                    obj[target] = [arr[0]];
                }
                return obj;
            }, {});

        const unusedFunctionResult = Object.entries(acResult).reduce(
            (obj: Record<string, number>, [k, v]: [string, number[]]) => {
                if (v.length > 1) {
                    return obj;
                } else {
                    obj[k] = v[0];
                    return obj;
                }
            },
            {},
        );

        const finalEntries = Object.entries(unusedFunctionResult);

        if (finalEntries.length) {
            linted = false;
        }

        finalEntries.reverse().forEach(([k, v]: [string, number]) => {
            const nextLineSeparator = joinedInput.indexOf(
                config.lineSeparator,
                v,
            );
            if (
                new RegExp(String.raw`^function ${k}\(.+ end$`).test(
                    joinedInput.slice(v - k.length - 9, nextLineSeparator),
                )
            ) {
                joinedInput = searchAndDestroyOneLiners(
                    config,
                    joinedInput,
                    k,
                    v,
                    nextLineSeparator,
                );
                return;
            }

            joinedInput = searchAndDestroyMultilineFunctions(
                config,
                joinedInput,
                k,
                v,
            );
        });
    }

    return joinedInput.trim();
}

export function searchAndDestroyOneLiners(
    config: LuaverConfig,
    joinedInput: string,
    functionName: string,
    functionIndex: number,
    nextLineSeparator: number,
) {
    let startIdx =
        joinedInput.lastIndexOf(
            config.lineSeparator,
            functionIndex - functionName.length - 11,
        ) + 1;
    let endIdx = functionIndex - functionName.length - 9;
    let prevLine = joinedInput.slice(startIdx, endIdx);
    while (prevLine.startsWith('---')) {
        endIdx = startIdx;
        startIdx =
            joinedInput.lastIndexOf(config.lineSeparator, startIdx - 2) + 1;
        prevLine = joinedInput.slice(startIdx, endIdx);
    }

    logs.add(
        `--- Trimming unused function data: --- \n${joinedInput.slice(endIdx, nextLineSeparator + 1).trim()}\n\n`,
    );

    joinedInput = joinedInput.replace(
        joinedInput.slice(endIdx, nextLineSeparator + 1),
        '',
    );

    return joinedInput;
}

export function searchAndDestroyMultilineFunctions(
    config: LuaverConfig,
    joinedInput: string,
    functionName: string,
    functionIndex: number,
) {
    const separatorLength = config.lineSeparator.length;

    let startIdx = joinedInput.lastIndexOf(
        config.lineSeparator,
        Math.max(0, functionIndex - functionName.length - 11),
    ); // 1 from \n, 9 from `function `, 1 extra to compensate

    let prevStartIdx = startIdx + 1;
    if (startIdx === 0) prevStartIdx = 0;
    while (joinedInput.charAt(prevStartIdx) !== config.lineSeparator)
        prevStartIdx++;
    let endIdx = functionIndex;
    let endFound = false;

    while (startIdx >= 0) {
        if (
            joinedInput.slice(
                startIdx + separatorLength,
                startIdx + separatorLength + 3,
            ) !== '---'
        )
            break;
        prevStartIdx = startIdx;
        startIdx = joinedInput.lastIndexOf(config.lineSeparator, startIdx - 1);
    }

    while (endIdx < joinedInput.length && !endFound) {
        if (
            joinedInput.slice(
                endIdx + separatorLength,
                endIdx + separatorLength + 3,
            ) === 'end'
        )
            endFound = true;
        endIdx = joinedInput.indexOf(config.lineSeparator, endIdx + 1);
    }

    logs.add(
        `--- Trimming unused function data: --- \n${joinedInput.slice(prevStartIdx, endIdx).trim()}\n\n`,
    );

    joinedInput = joinedInput.replace(
        joinedInput.slice(prevStartIdx, endIdx),
        '',
    );

    return joinedInput;
}
