use crate::config::definition::LuaverConfig;
use emmylua_parser::{LuaAstNode, LuaComment, LuaSyntaxTree};

pub fn lint_comments(input: &mut String, _: &LuaverConfig, ast: &mut LuaSyntaxTree) {
    let root_chunk = ast.get_chunk_node();

    let mut slice_ranges: Vec<[u32; 2]> = vec![];

    for node in root_chunk.descendants::<LuaComment>() {
        let range = node.get_range();
        slice_ranges.push([range.start().into(), range.end().into()]);
    }

    slice_ranges.sort_unstable_by(|a, b| b[1].cmp(&a[1]));

    for range in slice_ranges.into_iter() {
        input.replace_range((range[0] as usize)..(range[1] as usize), "");
    }
}
