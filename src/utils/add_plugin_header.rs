use crate::config::definition::LuaverConfig;

pub fn add_plugin_header(out: &mut Vec<String>, cfg: &LuaverConfig) {
    let sep = cfg.line_separator.to_string();

    if cfg.plugin_version.is_some() {
        out.push(format!(
            "PLUGIN_VERSION=\"{}\"",
            cfg.plugin_version.as_ref().unwrap()
        ));
    }
    if cfg.plugin_description.is_some() {
        out.push(format!(
            "PLUGIN_DESCRIPTION=\"{}\"",
            cfg.plugin_description.as_ref().unwrap()
        ));
    }

    out.push(format!(
        "PLUGIN_NAME=\"{}\"{}PLUGIN_AUTHOR=\"{}\"{}imgui_disable_vector_packing=true",
        cfg.plugin_name, sep, cfg.plugin_author, sep,
    ));
}
