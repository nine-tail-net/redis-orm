import { Operator } from "./Operator"
import { PrimitiveValue } from "./common"

export type FindOptions<T> = {
    where: WhereOptions<T>[]
}

export type WhereOptions<T = { [key: string]: Operator | PrimitiveValue }> = {
    [key in keyof T]: Operator | PrimitiveValue
}

// export type WhereValue =
//     | string
//     | number
//     | boolean

// export type WhereOperators =
//     | "$eq"
//     | '$ne'
//     | '$gt'
//     | '$lt'

// export type WhereParams = { [key in WhereOperators]: WhereValue }
// export type Where = { [key: string]: ExclusiveKeys<WhereParams> | WhereValue }
