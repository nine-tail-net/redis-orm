import { SchemaFieldTypes } from "redis"

export type SchemaPropertyType =
    | SchemaFieldTypes.TEXT
    | SchemaFieldTypes.NUMERIC
    | SchemaFieldTypes.TAG

export type SchemaProperty = SchemaPropertyType
