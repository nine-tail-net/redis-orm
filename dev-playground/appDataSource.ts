import { createClient } from "redis"
import * as entities from "./Entities"
import { DataSource } from "../src"

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
    await AppDataSource.initialize()
})
