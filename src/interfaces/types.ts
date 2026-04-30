export interface LiteralMap {
    string: string;
    number: number;
    boolean: boolean;
    bigint: bigint;
    null: null;
    undefined: undefined;
    LineSeparator: '\n' | '\r\n';
}

type ArrayPrimitives<M> = M & { [K in keyof M as K extends `${infer T}` ? `${T}[]` : K]: M[K][] };

type OptionalPrimitives<M> = M & {
    [K in keyof M as K extends `${infer T}` ? `${T}?` : K]: M[K] | undefined;
};

type TypeMap = OptionalPrimitives<ArrayPrimitives<LiteralMap>>;

export default TypeMap;
