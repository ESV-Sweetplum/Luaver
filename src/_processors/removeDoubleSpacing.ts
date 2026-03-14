import LuaverConfig from '../interfaces/luaverConfig';

export default function removeDoubleSpacing(
    input: string[],
    config: LuaverConfig
) {
    return input
        .join('\n')
        .replaceAll(/\n{2,}/g, config.lineSeparator)
        .trimStart();
}
