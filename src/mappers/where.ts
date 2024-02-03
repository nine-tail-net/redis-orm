import { Schema, WhereOptions, } from "../types";
import { isFindOperator, isPrimitive } from "../utils";
import { OperatorMapper } from "./operators";
import { Equal } from "../operators/FindOperators";
import { wheresToRedisQuery } from "./wheresToRedisQuery";

export function convertWhere(schema: Schema, ...wheres: WhereOptions[]): string {
    if (!wheres.length) return ""
    return wheresToRedisQuery(
        wheres.map(where => parseParameters(where, schema)).flat(),
        schema.properties
    )
}

export function parseParameters(where: WhereOptions, schema: Schema): string[] {
    const filters: string[] = [];
    for (let key in where) {
        if (!(key in schema.properties))
            throw new Error(`${key} not exist in ${schema.name} entity.`)

        const value = where[key as keyof typeof where]
        const schemaPropertyType = schema.properties[key]

        if (isFindOperator(value))
            filters.push(OperatorMapper(value, key, schemaPropertyType))
        else if (isPrimitive(value))
            filters.push(OperatorMapper(Equal(value), key, schemaPropertyType))
        else
            throw new Error("Value type not supported.")
    }
    return filters
}
