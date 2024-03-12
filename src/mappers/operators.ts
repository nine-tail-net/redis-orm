import { SchemaFieldTypes } from "redis";
import { Operators } from "../types/Operator";
import { SchemaPropertyType } from "../types/SchemaProperty";
import { isFindOperator } from "../utils";
import { Equal } from "../operators/FindOperators";

const escapeSpecialChars = (srt: string) => srt.replace(/[`,.<>{}[\]"':;!@#$%^&*()\-+=~\s]/g, match => "\\" + match)

export function OperatorMapper({ type, value }: Operators, propertyName: string, propertyType: SchemaPropertyType): string {
    switch (type) {
        case "equal":
            if (propertyType === SchemaFieldTypes.TEXT)
                return `@${propertyName}:(${value})`
            else if (propertyType === SchemaFieldTypes.TAG)
                return `@${propertyName}:{${escapeSpecialChars(value + "")}}`
            else if (propertyType === SchemaFieldTypes.NUMERIC)
                return `@${propertyName}:[${value} ${value}]`
        case "not":
            return "-" + OperatorMapper(
                isFindOperator(value) ? value : Equal(value),
                propertyName,
                propertyType
            )
        default:
            throw new Error(`Operator ${type} not supported.`)
    }
}
