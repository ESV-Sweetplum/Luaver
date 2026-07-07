import LuaverConfig from '../interfaces/luaverConfig';

export default function removeDoubleSpacing(input: string[], config: LuaverConfig) {
    const regex = new RegExp(String.raw`${config.lineSeparator}{2,}`, 'g');

    return input.join('\n').replaceAll(regex, config.lineSeparator).trim();
}
