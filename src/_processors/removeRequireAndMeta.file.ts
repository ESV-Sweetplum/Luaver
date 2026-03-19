export default function removeRequireAndMeta(output: string[]) {
    return output.filter((line) => {
        return (
            !/^require\(('").+?('")\)/.test(line) && !/^\s*---@meta/.test(line)
        );
    });
}
