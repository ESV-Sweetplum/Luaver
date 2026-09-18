use crate::config::definition::LuaverConfig;

pub fn remove_requires(input: &mut Vec<String>, _: &LuaverConfig) {
    input.retain(|s| !s.contains("require("));
}
