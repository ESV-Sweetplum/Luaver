mod utils;
use utils::sources;

use std::{error::Error, fs, path::Path, time::Instant};

fn main() -> Result<(), Box<dyn Error>> {
    let mut out: Vec<String> = Vec::new();

    let start = Instant::now();
    let src = sources::get_source_code("plugin")?;

    let finalized_entry_code = src.entry_bufs.finalize();

    out.extend(src.non_entry_bufs);
    out.extend(finalized_entry_code);

    fs::write(Path::new("plugin.lua"), out.join("\n"))?;

    let duration = start.elapsed();
    println!("{:?}", duration);

    Ok(())
}
