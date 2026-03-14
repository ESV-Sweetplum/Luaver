import * as json5 from 'json5';
import * as fs from 'fs';

const luaverConfig = json5.parse(
    fs.readFileSync('./luaverConfig.json5', 'utf-8')
);

export default luaverConfig;
