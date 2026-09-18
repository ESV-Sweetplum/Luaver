use emmylua_parser::LuaSyntaxTree;
use regex::Regex;

use crate::config::definition::LuaverConfig;

pub fn lint_whitespace(input: &mut String, cfg: &LuaverConfig, ast: &mut LuaSyntaxTree) {
    let sep = &cfg.line_separator.to_string();
    let re = Regex::new(&format!(r"{}{{2,}}", sep)).unwrap();

    *input = re.replace_all(input, sep).to_string();
}
