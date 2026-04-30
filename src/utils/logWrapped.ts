import wrapAnsi from 'wrap-ansi';

declare global {
    interface Console {
        logWrapped(msg: string, columns?: number): void;
    }
}

console.logWrapped = (msg: string, columns?: number) => {
    console.log(wrapAnsi(msg ?? '', columns ?? process.stdout.columns));
};

export {};
