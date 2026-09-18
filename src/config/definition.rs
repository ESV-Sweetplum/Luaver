use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct LuaverConfig {
    pub plugin_name: String,
    pub plugin_version: Option<String>,
    pub plugin_author: String,
    pub plugin_description: Option<String>,
    pub line_separator: LineSeparator,
    pub sources: Vec<String>,
    pub out_dir: String,
}

#[derive(Debug, Deserialize)]
pub enum LineSeparator {
    LF,
    CRLF,
}

impl LineSeparator {
    pub fn to_string(&self) -> String {
        match self {
            LineSeparator::LF => String::from("\n"),
            LineSeparator::CRLF => String::from("\r\n"),
        }
    }
}
