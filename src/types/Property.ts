import * as RedisTypes from "redis"

export type PropertyType =
    | "text"
    | "numeric"

export type PropertyOption = {
    type: PropertyType,
    // name?: string
}

export type PropertyMetadata = {
    object: object,
    propertyName: string,
    options: PropertyOption
}

export const propertyTypes = {
    "text": RedisTypes.SchemaFieldTypes.TEXT,
    "numeric": RedisTypes.SchemaFieldTypes.NUMERIC
    // "tag": RedisTypes.SchemaFieldTypes.TAG,
}
