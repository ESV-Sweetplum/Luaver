export default function removeRequireAndMeta(output: string[]) {
    return output.filter((line) => {
        !/^require\(('").+?('")\)/.test(line) && !/^\s*---@meta/.test(line);
    });
}
