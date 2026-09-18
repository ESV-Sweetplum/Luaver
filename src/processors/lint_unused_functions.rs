use std::collections::{HashMap, hash_map::Entry};

use crate::config::definition::LuaverConfig;
use aho_corasick::AhoCorasick;
use emmylua_parser::{
    LuaAstNode, LuaCallExpr, LuaFuncStat, LuaIndexExpr, LuaKind, LuaNameExpr, LuaParser,
    LuaSyntaxTree, ParserConfig, PathTrait,
};
use regex::Regex;

pub fn ast_mode(input: &mut String, _: &LuaverConfig, ast: &mut LuaSyntaxTree) {
    let mut linted = false;
    let mut iteration_count = 0;

    while !linted && iteration_count < 10 {
        let root_chunk = ast.get_chunk_node();
        let root_block = root_chunk.get_block().unwrap();

        iteration_count += 1;
        linted = true;
        let mut function_map: HashMap<String, i32> = HashMap::new();
        let mut function_ranges: HashMap<String, [u32; 2]> = HashMap::new();

        for node in root_block.children::<LuaFuncStat>() {
            let func_expr = node.get_func_name().unwrap();
            let func_name = func_expr.get_text();
            let range = node.get_range();
            function_map.insert(
                func_name.clone(),
                if func_name.contains("string") { 1 } else { 0 },
            );
            function_ranges.insert(func_name, [range.start().into(), range.end().into()]);
        }

        for call_expr in root_chunk.descendants::<LuaCallExpr>() {
            let caller = call_expr.get_prefix_expr().unwrap().syntax().to_owned();

            match &caller.kind() {
                LuaKind::Syntax(emmylua_parser::LuaSyntaxKind::NameExpr) => {
                    *function_map
                        .entry(LuaNameExpr::cast(caller).unwrap().get_name_text().unwrap())
                        .or_insert(0) += 1;
                }
                LuaKind::Syntax(emmylua_parser::LuaSyntaxKind::IndexExpr) => {
                    let name_expr = LuaIndexExpr::cast(caller).unwrap();
                    let name_text = name_expr.get_text();

                    if name_text.contains("(") {
                        let accessor = name_expr.get_access_path().unwrap_or(String::from(""));
                        let split_result = accessor.rsplit_once(".");
                        if let Some(res) = split_result {
                            *function_map.entry(res.1.to_string()).or_insert(0) += 1;
                        }
                    } else {
                        *function_map.entry(name_text).or_insert(0) += 1;
                    }
                }
                _ => {}
            }
        }

        let mut slice_ranges: Vec<[u32; 2]> = vec![];

        for (func, ct) in &function_map {
            if *ct != 0 || func == "draw" || func == "awake" {
                continue;
            }

            let range_entry = function_ranges.entry(func.to_string());
            if let Entry::Vacant(_) = range_entry {
                continue;
            }
            let range = range_entry.or_default();
            linted = false;
            slice_ranges.push(*range)
        }

        slice_ranges.sort_unstable_by(|a, b| b[1].cmp(&a[1]));

        for range in slice_ranges.into_iter() {
            input.replace_range((range[0] as usize)..(range[1] as usize), "");
        }

        *ast = LuaParser::parse(&input, ParserConfig::default());
    }

    println!("{:?}", iteration_count)
}

pub fn str_mode(input: &mut String, _: &LuaverConfig, ast: &mut LuaSyntaxTree) {
    let root_chunk = ast.get_chunk_node();
    let root_block = root_chunk.get_block().unwrap();
    let mut function_counts: HashMap<String, i32> = HashMap::new();
    let mut function_ranges: HashMap<String, [u32; 2]> = HashMap::new();

    for node in root_block.children::<LuaFuncStat>() {
        let func_expr = node.get_func_name().unwrap();
        let func_name = func_expr.get_text();
        let range = node.get_range();
        if func_name.starts_with("string")
            || func_name.starts_with("table")
            || func_name == "awake"
            || func_name == "draw"
        {
            continue;
        }
        function_counts.insert(func_name.clone(), -1);
        function_ranges.insert(func_name, [range.start().into(), range.end().into()]);
    }

    let match_filter = Regex::new(r"([\(,\)\{\} ]|= )").unwrap();

    for _iteration in 1..=1 {
        let linted = true;
        let patterns: Vec<String> = function_ranges
            .iter()
            .map(|(f, _)| {
                vec![
                    format!("{f}("),
                    format!("{f},"),
                    format!("{f})"),
                    format!("= {f}"),
                    format!("{f} {{"),
                ]
            })
            .flatten()
            .collect();

        let ac = AhoCorasick::builder()
            .ascii_case_insensitive(true)
            .build(&patterns)
            .unwrap();

        for mtch in ac.find_iter(&input) {
            let func = patterns.get(mtch.pattern().as_usize());
            if let Some(f) = func {
                let func_name = match_filter.replace_all(f, "");
                *function_counts.entry(func_name.to_string()).or_insert(0) += 1;
            }
        }

        function_counts.retain(|_f, v| *v == 69);
        println!("{:?}", function_counts)
    }
}
