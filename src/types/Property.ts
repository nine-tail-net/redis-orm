import { SchemaPropertyType } from "./SchemaProperty"

export type PropertyType<T = { [key in SchemaPropertyType]: Lowercase<key> }> = T[keyof T]

export type PropertyOption = {
    type: PropertyType,
}

export type PropertyMetadata = {
    object: object,
    propertyName: string,
    options: PropertyOption
}
