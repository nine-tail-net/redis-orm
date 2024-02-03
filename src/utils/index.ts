import { Operators, Operator } from "../types";
import { PrimitiveValue } from "../types/common";


export function isPrimitive(value: any): value is PrimitiveValue {
    const valueType = typeof value;
    return valueType === "number"
        || valueType === "string";
}

export function isFindOperator(value: any): value is Operators {
    return value instanceof Operator;
}

export function isEmptyObject(value: object) {
    return Object.keys(value).length > 0;
}
