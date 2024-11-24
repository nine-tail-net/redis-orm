import "reflect-metadata";
import * as RedisTypes from "redis"
import { EntityClass } from "./types"
import { internalStorage } from "./internalStorage"
import { getRepository } from "./repository/Repository"
import { Schema } from "./types/Schema";
import { SchemaPropertyType } from "./types/SchemaProperty";

export type RedisClient = RedisTypes.RedisClientType<
    RedisTypes.RedisDefaultModules,
    RedisTypes.RedisFunctions,
    RedisTypes.RedisScripts
>

export class DataSource {
    readonly client: RedisClient
    readonly schemas: Schema[] = []
    readonly entities: EntityClass[] = []
    private synchronizeSchemas?: boolean
    private createIndexes: boolean

    constructor({ client, entities, sync, createIndexes }: {
        client: RedisClient,
        entities: EntityClass[],
        sync?: boolean,
        createIndexes: boolean
    }) {
        for (let entity of entities) {
            const schema = this.createSchema(entity)

            internalStorage.pushEntityDefinition(entity, {
                connection: client, schema
            })
            this.schemas.push(schema)
        }
        this.client = client
        this.entities = entities
        this.createIndexes = createIndexes
        this.synchronizeSchemas = sync
    }

    private createSchema(entity: EntityClass): Schema {
        const entityWorkspace = internalStorage.getEntityWorkspace(entity)
        if (!entityWorkspace.entityOptions)
            throw new Error(`Entity is not specified`)

        const { entityOptions, propertyMetadata } = entityWorkspace

        const properties: Schema["properties"] = {}
        for (let { propertyName, options } of propertyMetadata) {
            if (entityOptions.type === "HASH")
                //@ts-ignore
                properties[propertyName] = Object.fromEntries(Object.entries(options).map(([key, value]) => key == "type" ? [key, value.toUpperCase() as SchemaPropertyType] : [key.toUpperCase(), value]))
            else
                throw new Error(`Entity type: ${entityOptions.type} is not supported in this time.`)
        }

        return {
            name: entityOptions.name,
            index: `idx:${entityOptions.name}`,
            properties,
            options: {
                ON: entityOptions.type,
                PREFIX: `${entityOptions.name}:`
            }
        }
    }

    private async createIndex(schema: Schema) {
        console.log(schema)

        let index = await this.client.ft.info(schema.index).catch(_ => _)
        
        if (index && !this.synchronizeSchemas) return;

        await this.client.ft.dropIndex(schema.index).catch(_ => _)

        await this.client.ft.create(
            //@ts-ignore
            schema.index,
            schema.properties,
            schema.options
        )

        console.log(`Created Index: ${schema.index}`)
    }

    async initialize() {
        if (!this.client.isReady)
            throw new Error("Redis client not init")

        if (this.createIndexes)
            await Promise.all(this.schemas.map(
                schema => this.createIndex(schema)
            ))
    }

    getRepository(entity: new () => any) {
        return getRepository(entity)
    }

}
