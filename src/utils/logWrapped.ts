import wrapAnsi from 'wrap-ansi';

declare global {
    interface Console {
        logWrapped(msg: string, columns?: number, trim?: boolean): void;
    }
}

console.logWrapped = (msg: string, columns?: number, trim?: boolean) => {
    console.log(wrapAnsi(msg ?? '', columns ?? process.stdout.columns, { trim: trim ?? true }));
};

export {};
