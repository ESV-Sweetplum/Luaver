import LuaverConfig from '../interfaces/luaverConfig';

export default function removeRequireAndMeta(
    input: string[],
    config: LuaverConfig
) {
    let output = input
        .filter((l) => l && !l.includes('require('))
        .join(config.lineSeparator);

    output = output.replaceAll(/---@meta [a-zA-Z0-9\-]+\n/g, '');

    return output
}
