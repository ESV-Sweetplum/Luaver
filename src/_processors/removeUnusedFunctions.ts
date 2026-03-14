import LuaverConfig from '../interfaces/luaverConfig';
import * as acBuilder from 'ahocorasick';
import getFunctionList from '../utils/getFunctionList';

export default function LintUnusedFunctions(
    input: string[],
    config: LuaverConfig
) {
    const separatorLength = config.lineSeparator.length;

    let linted = false;
    let joinedInput = input.join(config.lineSeparator);

    while (!linted) {
        linted = true;

        let functions = getFunctionList(input).filter(
            (name) =>
                !name.startsWith('string') &&
                !name.startsWith('table') &&
                !['awake', 'draw'].includes(name)
        );

        const ac = new acBuilder(
            functions.map((fn) => [`${fn}(`, `${fn},`, `${fn})`]).flat()
        );
        const acResult = ac.search(joinedInput).reduce((obj, arr) => {
            const target = arr[1][0].replaceAll(/[\(,\)]/g, '');
            if (obj[target]) {
                obj[target].push(arr[0]);
            } else {
                obj[target] = [arr[0]];
            }
            return obj;
        }, {});

        Object.entries(acResult).forEach(([k, v]: [string, number[]]) => {
            if (v.length > 1) {
                delete acResult[k];
            } else {
                acResult[k] = v[0];
            }
        });

        const finalEntries = Object.entries(acResult);

        if (finalEntries.length) {
            linted = false;
        }

        const outputLength = joinedInput.length;

        finalEntries.reverse().forEach(([k, v]: [string, number]) => {
            let startIdx = joinedInput.lastIndexOf(
                config.lineSeparator,
                v - k.length - 11
            ); // 1 from \n, 9 from `function `, 1 extra to compensate
            let prevStartIdx = startIdx + 1;
            while (joinedInput.charAt(prevStartIdx) !== config.lineSeparator)
                prevStartIdx++;
            let endIdx = v;
            let endFound = false;

            while (startIdx >= 0) {
                if (
                    joinedInput.slice(
                        startIdx + separatorLength,
                        startIdx + separatorLength + 3
                    ) !== '---'
                )
                    break;
                prevStartIdx = startIdx;
                startIdx = joinedInput.lastIndexOf(
                    config.lineSeparator,
                    startIdx - 1
                );
            }

            while (endIdx < outputLength && !endFound) {
                if (
                    joinedInput.slice(
                        endIdx + separatorLength,
                        endIdx + separatorLength + 3
                    ) === 'end'
                )
                    endFound = true;
                endIdx = joinedInput.indexOf(config.lineSeparator, endIdx + 1);
            }

            joinedInput = joinedInput.replace(
                joinedInput.slice(prevStartIdx, endIdx),
                ''
            );
        });
    }

    return joinedInput;
}
