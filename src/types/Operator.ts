import { PrimitiveValue } from "./common";

export class Operator<S extends KeysOperatorTypes = KeysOperatorTypes>{
    readonly "@instanceof" = Symbol("operator")
    constructor(readonly value: OperatorTypes[S], readonly type: S) {
    }
}
export type KeysOperatorTypes = keyof OperatorTypes

export type OperatorTypes = {
    equal: PrimitiveValue,
    not: PrimitiveValue | Operator<"equal">,
    or: (PrimitiveValue | Operator<"equal"> | Operator<"not">)[]
}

