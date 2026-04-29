export default interface LuaverConfig {
    pluginName: string; // Also exposed to the PLUGIN_NAME global in Lua.
    pluginVersion: string; // Also exposed to the PLUGIN_VERSION global in Lua.
    pluginAuthor: string; // Also exposed to the PLUGIN_AUTHOR global in Lua.
    pluginDescription: string; // Also exposed to the PLUGIN_DESCRIPTION global in Lua.
    includeVersionInPluginName: boolean; // If true, will put the version into the plugin name in the settings.ini file.
    buildVersionInPluginName: boolean; // If true, will put the version into the build name in the settings.ini file.
    sources: string[]; // Folders which should be included in the final plugin.
    outDir: string; // Output location with respect to distributed Luaver root.
    lineSeparator: '\n' | '\r\n'; // Consistent line separator for the plugin.
    dontRandomizeSeed: boolean; // If true, omits the math.randomseed(os.time()) line at the top of the plugin.
    workshopFolder: string; // The folder which should contain your steam workshop data.
}

export const LuaverConfigSchema: Record<string, 'string' | 'boolean' | 'number' | 'string[]'> = {
    pluginName: 'string',
    pluginVersion: 'string',
    pluginAuthor: 'string',
    pluginDescription: 'string',
    includeVersionInPluginName: 'boolean',
    buildVersionInPluginName: 'boolean',
    sources: 'string[]',
    outDir: 'string',
    lineSeparator: 'string',
    dontRandomizeSeed: 'boolean',
    workshopFolder: 'string',
};
