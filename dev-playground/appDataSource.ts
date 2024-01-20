import { createClient } from "redis"
import * as entities from "./Entities"
import { DataSource } from "../src/DataSource"

const client = createClient()

client.on('error', err => {
    throw new Error(`Redis Client Error, ${err}`)
})

export const AppDataSource = new DataSource({
    client,
    entities: Object.values(entities),
    sync: true
})

client.connect().then(async _ => {
    AppDataSource.initialize()
})
