use crate::config::definition::LuaverConfig;

pub fn remove_carriage_return(input: &mut Vec<String>, _: &LuaverConfig) {
    let iter = input.iter();
    let cr_less_map = iter.map(|s| s.replace("\r", ""));

    *input = cr_less_map.collect();
}
