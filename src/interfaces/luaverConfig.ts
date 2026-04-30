import TypeMap from './types';

export const LuaverConfigSchema = {
    pluginName: 'string',
    pluginVersion: 'string?',
    pluginAuthor: 'string',
    pluginDescription: 'string?',
    devVersionInPluginName: 'boolean?',
    buildVersionInPluginName: 'boolean?',
    sources: 'string[]',
    outDir: 'string',
    lineSeparator: 'LineSeparator',
    dontRandomizeSeed: 'boolean?',
    workshopFolder: 'string?',
    disableDefaultProcessors: 'boolean?',
    externalProcessors: 'string[]?',
} as const;

type LuaverConfig = {
    [K in keyof typeof LuaverConfigSchema]: TypeMap[(typeof LuaverConfigSchema)[K]];
};

export default LuaverConfig;
