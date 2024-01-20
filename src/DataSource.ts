import "reflect-metadata";
import * as RedisTypes from "redis"
import { Entity, EntityOptions, propertyTypes } from "./types"
import { internalStorage } from "./internalStorage"
import { Repository } from "./repository/Repository"

export type RedisClient = RedisTypes.RedisClientType<
    RedisTypes.RedisDefaultModules,
    RedisTypes.RedisFunctions,
    RedisTypes.RedisScripts
>

export type Schema = {
    name: string
    index: `idx:${string}`,
    properties: RedisTypes.RediSearchSchema,
    options: {
        ON: EntityOptions["type"],
        PREFIX: `noderedis:${string}`
    }
}

export class DataSource {
    readonly client: RedisClient
    readonly schemas: Schema[] = []
    readonly entities: Entity[] = []
    private synchronizeSchemas?: boolean

    constructor({ client, entities, sync }: {
        client: RedisClient,
        entities: Entity[],
        sync?: boolean
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
        this.synchronizeSchemas = sync
    }

    private createSchema(entity: Entity): Schema {
        const entityWorkspace = internalStorage.getEntityWorkspace(entity)
        if (!entityWorkspace.entityOptions)
            throw new Error(`Entity is not specified`)

        const { entityOptions, propertyMetadata } = entityWorkspace

        const properties: RedisTypes.RediSearchSchema = {}
        for (let { propertyName, options } of propertyMetadata) {
            if (entityOptions.type === "HASH")
                properties[propertyName] = propertyTypes[options.type]
            else
                throw new Error(`Entity type: ${entityOptions.type} is not supported in this time.`)
        }

        return {
            name: entityOptions.name,
            index: `idx:${entityOptions.name}`,
            properties,
            options: {
                ON: entityOptions.type,
                PREFIX: `noderedis:${entityOptions.name}`
            }
        }
    }

    private async createIndex(schema: Schema) {
        // const info = await this.client.ft.info(schema.index)
        await this.client.ft.dropIndex(schema.index).catch(_ => _)
        await this.client.ft.create(
            schema.index,
            schema.properties,
            schema.options
        )
        console.log(`Created Index: ${schema.index}`)
    }

    async initialize() {
        if (!this.client.isReady)
            throw new Error("Redis client not init")

        if (this.synchronizeSchemas)
            this.schemas.map(
                async schema => await this.createIndex(schema)
            )
    }

    getRepository(entity: new () => any) {
        return Repository(entity)
    }

}
