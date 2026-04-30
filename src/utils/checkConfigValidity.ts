import { LuaverConfigSchema } from '../interfaces/luaverConfig';
import luaverConfig from './getConfig';

export default function checkConfigValidity() {
    const missingParams: [string, string][] = [];

    if (luaverConfig?.sources.length === 1) missingParams.push(['sources', 'string[]']);
    if (!luaverConfig) return [['MISSING CONFIG', 'MISSING CONFIG']];

    Object.entries(LuaverConfigSchema).forEach(([k, t]) => {
        if (!(k in luaverConfig) && !t.includes('?')) {
            missingParams.push([k, t]);
        }
    });

    return missingParams;
}

export interface Violation {
    type: 'WrongType' | 'Missing';
    key: string;
    message: string;
}

export function checkConfigViolation() {
    const violations: Violation[] = [];

    if (!luaverConfig) {
        Object.keys(LuaverConfigSchema).forEach(k => {
            violations.push({ type: 'Missing', key: k, message: 'Required entry was not given.' });
        });
        return violations;
    }

    Object.entries(LuaverConfigSchema).forEach(([k, t]: [string, string]) => {
        const correspondingEntry = luaverConfig[k as keyof typeof LuaverConfigSchema];
        if (!t.includes('?') && correspondingEntry == undefined) {
            violations.push({ type: 'Missing', key: k, message: 'Required entry was not given.' });
        }
        t = t.replaceAll('?', '');
        if (t.includes('[]') && correspondingEntry) {
            if (!Array.isArray(correspondingEntry)) {
                violations.push({ type: 'WrongType', key: k, message: "Specified array and didn't get one." });
            } else if (!correspondingEntry.every(i => typeof i === t)) {
                violations.push({
                    type: 'WrongType',
                    key: k,
                    message: "One or more elements in this array isn't the designated type.",
                });
            }
        } else {
            if (typeof correspondingEntry !== t && correspondingEntry && t !== 'LineSeparator') {
                violations.push({
                    type: 'WrongType',
                    key: k,
                    message: `Given ${typeof correspondingEntry} when the config expected ${t}.`,
                });
            }
        }
    });

    return violations;
}
