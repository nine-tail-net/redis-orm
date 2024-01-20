import { RedisClient, Schema } from "../DataSource"

export type EntityType =
    | "HASH"
// | "JSON"

export type EntityOptions = {
    name: string,
    type: EntityType
}

export class Entity { }

export type EntityDefinition = {
    schema: Schema,
    connection: RedisClient
}
