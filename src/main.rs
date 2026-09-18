mod utils;
use emmylua_parser::{LuaParser, ParserConfig};
use utils::sources;

mod config;
mod processors;

use std::{env, error::Error, fs, time::Instant};

use crate::utils::{add_plugin_header::add_plugin_header, sources::EntryCode};

fn main() -> Result<(), Box<dyn Error>> {
    let luaver_cfg = config::load()?;

    let mut out: Vec<String> = vec![];
    let start = Instant::now();

    add_plugin_header(&mut out, &luaver_cfg);

    let source_list = &luaver_cfg.sources;
    let mut finalized_entry_code = EntryCode {
        awake: vec![],
        draw: vec![],
    };

    let plugin_array_processors = vec![
        processors::remove_carriage_return,
        processors::remove_requires,
    ];

    let plugin_string_processors = vec![
        processors::lint_unused_functions::str_mode,
        processors::lint_comments,
        processors::lint_whitespace,
    ];

    for src in source_list {
        let code = sources::get_source_code(src, &luaver_cfg)?;

        out.extend(code.non_entry_bufs);
        finalized_entry_code.combine(code.entry_bufs);
    }

    out.extend(finalized_entry_code.finalize());

    for processor in plugin_array_processors {
        processor(&mut out, &luaver_cfg)
    }

    let mut final_out = out.join(&luaver_cfg.line_separator.to_string());

    for processor in plugin_string_processors {
        let mut ast = LuaParser::parse(&final_out, ParserConfig::default());
        processor(&mut final_out, &luaver_cfg, &mut ast);
    }

    let out_dir = env::current_dir()?.join(&luaver_cfg.out_dir);
    fs::write(out_dir.join("plugin.lua"), final_out)?;

    let duration = start.elapsed();
    println!("{:?}", duration);

    Ok(())
}
