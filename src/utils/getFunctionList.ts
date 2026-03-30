export default function getFunctionList(file: string[]): string[] {
    return file.reduce((fns: string[], line) => {
        if (line.startsWith('function ') && line.includes('(')) {
            fns.push(line.split('function ')[1].split('(')[0]);
        }
        return fns;
    }, []);
}
