use std::{
    error::Error,
    fs,
    path::{Path, PathBuf},
};

#[derive(Clone, Debug)]
pub struct EntryCode {
    pub awake: Vec<String>,
    pub draw: Vec<String>,
}

use crate::config::definition::LuaverConfig;

impl EntryCode {
    fn extend_awake(&mut self, iter: Vec<String>) {
        self.awake.extend(iter);
    }

    fn extend_draw(&mut self, iter: Vec<String>) {
        self.draw.extend(iter);
    }

    fn precurse_awake(&mut self, iter: Vec<String>) {
        self.awake.splice(..0, iter);
    }

    fn precurse_draw(&mut self, iter: Vec<String>) {
        self.draw.splice(..0, iter);
    }

    pub fn finalize(&self) -> Vec<String> {
        let mut out: Vec<String> = vec![String::from("function draw()")];
        out.extend(self.clone().draw);
        out.push(String::from("end\nfunction awake()"));
        out.extend(self.clone().awake);
        out.push(String::from("end"));
        return out;
    }

    pub fn combine(&mut self, entry2: EntryCode) {
        self.awake.extend(entry2.awake);
        self.draw.extend(entry2.draw);
    }
}

use crate::utils::constants::ENTRIES;

pub struct SourceCode {
    pub non_entry_bufs: Vec<String>,
    pub entry_bufs: EntryCode,
}

pub fn get_source_code(source: &str, cfg: &LuaverConfig) -> Result<SourceCode, Box<dyn Error>> {
    let filter = |s: &str| s.ends_with(".lua") && !s.contains("intellisense");

    let mut paths = get_paths_recursively(Path::new(source), &filter)?;
    let mut non_entry_bufs: Vec<String> = Vec::new();
    let mut entry_bufs: EntryCode = EntryCode {
        awake: Vec::new(),
        draw: Vec::new(),
    };

    paths.sort_unstable_by_key(|p| {
        (
            !p.to_string_lossy().contains(".priority."),
            p.to_string_lossy().to_lowercase(),
        )
    });

    for p in paths {
        let path_string = p.to_str().expect("The given path {p} should be unicode.");
        let buf_vctr = get_file(&p, cfg)?;

        if path_string.contains("draw") || path_string.contains("awake") {
            let suffix_index = path_string
                .find(".")
                .expect("The given path string {path_string} didn't have a dot in it.");
            let suffix = &path_string[suffix_index..];
            match suffix {
                ".lua" => handle_entry_root(&mut entry_bufs, path_string, suffix_index, buf_vctr),
                ".draw.lua" => entry_bufs.extend_draw(buf_vctr),
                ".awake.lua" => entry_bufs.extend_awake(buf_vctr),
                ".precurse.draw.lua" => entry_bufs.precurse_draw(buf_vctr),
                ".precurse.awake.lua" => entry_bufs.precurse_awake(buf_vctr),
                _ => {
                    panic!(
                        "The entry file given by {path_string} did not match one of the possible cases."
                    )
                }
            }
        } else {
            non_entry_bufs.extend(buf_vctr);
        }
    }

    Ok(SourceCode {
        non_entry_bufs,
        entry_bufs,
    })
}

pub fn handle_entry_root(
    entry_bufs: &mut EntryCode,
    path_string: &str,
    suffix_index: usize,
    buf_vctr: Vec<String>,
) {
    let prefix = &path_string[..suffix_index];
    for k in ENTRIES {
        let search_key = format!("_{k}");
        if prefix.contains(&search_key) {
            match k {
                "awake" => entry_bufs.extend_awake(buf_vctr),
                "draw" => entry_bufs.extend_draw(buf_vctr),
                &_ => {}
            }
            break;
        }
    }
}

pub fn get_paths_recursively(
    root: &Path,
    pred: &dyn Fn(&str) -> bool,
) -> Result<Vec<PathBuf>, Box<dyn Error>> {
    let mut out = vec![];
    let rootdir = fs::read_dir(root)?;
    for p in rootdir {
        let path = p?;
        let file_name = path.file_name();
        let file_type = path.file_type()?;

        if file_type.is_dir() {
            let dir_name = file_name.to_string_lossy().into_owned();
            let combined_dir = root.join(dir_name);
            let paths = get_paths_recursively(&combined_dir, &pred)?;
            out.extend(paths);
        } else {
            let full_path = root.join(&file_name);
            match file_name.into_string() {
                Ok(s) => {
                    if pred(&s) {
                        out.push(full_path);
                    }
                }
                Err(_e) => {
                    continue;
                }
            }
        }
    }

    Ok(out)
}

pub fn get_file(path: &PathBuf, cfg: &LuaverConfig) -> Result<Vec<String>, Box<dyn Error>> {
    let file = fs::read_to_string(path)?;

    Ok(file
        .split(&cfg.line_separator.to_string())
        .map(String::from)
        .collect())
}
