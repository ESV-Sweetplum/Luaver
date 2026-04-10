import LuaverConfig from '../interfaces/luaverConfig';
import counters from '../utils/getArbitraryCounter';

export default function iPairStaticLint(str: string[], config: LuaverConfig) {
    let output = str.join(config.lineSeparator);

    const ipairMatches = [...output.matchAll(/for _, ([a-zA-Z0-9_]+) in ipairs\(([a-zA-Z0-9_, ]+)\) do\n( *)/g)];
    ipairMatches.forEach(match => {
        const idx = getCounterAndIncrement();
        output = output.replace(
            match[0],
            `for k${idx} = 1, #${match[2]} do${config.lineSeparator}${match[3]}local ${match[1]} = ${match[2]}[k${idx}]${config.lineSeparator}${match[3]}`,
        );
    });

    return output;
}

export function getCounterAndIncrement() {
    counters.ipair++;
    return counters.ipair;
}
