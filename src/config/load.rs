use std::{env, error::Error, fs};

use crate::config::definition::LuaverConfig;

pub fn load() -> Result<LuaverConfig, Box<dyn Error>> {
    let cwd = env::current_dir()?;
    let config_path = cwd.join("LuaverConfig.json5");

    let raw_cfg = fs::read_to_string(config_path)?;
    let out: LuaverConfig = json5::from_str(&raw_cfg)?;

    Ok(out)
}
