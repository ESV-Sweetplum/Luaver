use std::{
    error::Error,
    fs,
    path::{Path, PathBuf},
};

use crate::utils::constants::ENTRIES;

#[derive(Clone, Debug)]
pub struct EntryCode {
    pub awake: Vec<String>,
    pub draw: Vec<String>,
}

impl EntryCode {
    fn extend_awake(&mut self, iter: &mut dyn Iterator<Item = String>) {
        self.awake.extend(iter);
    }

    fn extend_draw(&mut self, iter: &mut dyn Iterator<Item = String>) {
        self.draw.extend(iter);
    }

    fn precurse_awake(&mut self, iter: &mut dyn Iterator<Item = String>) {
        self.awake.splice(..0, iter);
    }

    fn precurse_draw(&mut self, iter: &mut dyn Iterator<Item = String>) {
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
}

pub struct SourceCode {
    pub non_entry_bufs: Vec<String>,
    pub entry_bufs: EntryCode,
}

pub fn get_source_code(source: &str) -> Result<SourceCode, Box<dyn Error>> {
    let paths = get_paths_recursively(Path::new(source))?;
    let mut non_entry_bufs: Vec<String> = Vec::new();
    let mut entry_bufs: EntryCode = EntryCode {
        awake: Vec::new(),
        draw: Vec::new(),
    };

    for p in paths {
        let path_string = p.to_str().expect("The given path {p} should be unicode.");
        let buf = get_file(&p)?;
        let mut buf_vctr = buf.split("\n").map(|ln| String::from(ln));

        if ENTRIES.iter().any(|entry| path_string.contains(entry)) {
            let suffix_index = path_string
                .find(".")
                .expect("The given path string {path_string} didn't have a dot in it.");
            let suffix = &path_string[suffix_index..];
            match suffix {
                ".lua" => {
                    let prefix = &path_string[..suffix_index];
                    for k in ENTRIES {
                        let search_key = format!("_{k}");
                        if prefix.contains(&search_key) {
                            match k {
                                "awake" => entry_bufs.extend_awake(&mut buf_vctr),
                                "draw" => entry_bufs.extend_draw(&mut buf_vctr),
                                &_ => {}
                            }
                        }
                    }
                }
                ".draw.lua" => entry_bufs.extend_draw(&mut buf_vctr),
                ".awake.lua" => entry_bufs.extend_awake(&mut buf_vctr),
                ".precurse.draw.lua" => entry_bufs.precurse_draw(&mut buf_vctr),
                ".precurse.awake.lua" => entry_bufs.precurse_awake(&mut buf_vctr),
                _ => {
                    panic!(
                        "The entry file given by {path_string} did not match one of the possible cases."
                    )
                }
            }
        } else {
            non_entry_bufs.push(buf);
        }
    }

    Ok(SourceCode {
        non_entry_bufs,
        entry_bufs,
    })
}

pub fn get_paths_recursively(root: &Path) -> Result<Vec<PathBuf>, Box<dyn Error>> {
    let mut out = vec![];
    let rootdir = fs::read_dir(root)?;
    for p in rootdir {
        let path = p?;
        let file_name = path.file_name();
        let file_type = path.file_type()?;

        if file_type.is_dir() {
            let dir_name = file_name.to_string_lossy().into_owned();
            let combined_dir = root.join(dir_name);
            let paths = get_paths_recursively(&combined_dir)?;
            out.extend(paths);
        } else {
            let full_path = root.join(file_name);
            out.push(full_path);
        }
    }

    Ok(out)
}

pub fn get_file(path: &PathBuf) -> Result<String, Box<dyn Error>> {
    let file = fs::read_to_string(path)?;

    Ok(file)
}
