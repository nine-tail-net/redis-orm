import { SchemaFieldTypes } from "redis"

export type SchemaPropertyType =
    | SchemaFieldTypes.TEXT
    | SchemaFieldTypes.NUMERIC

export type SchemaProperty = SchemaPropertyType
