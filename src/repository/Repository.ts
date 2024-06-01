import { v4 as uuidv4 } from 'uuid';
import { internalStorage } from "../internalStorage"
import { convertWhere } from "../mappers/where"
import { FindOneOptions, FindOptions, FindResult } from "../types"
import { isEmptyObject } from "../utils";

export function Repository<Entity extends object>(entity: new (...args: any[]) => Entity) {
    return class Repository extends entity {
        static async get<T extends Entity>(this: { new(): T }, id: string) {
            const { connection } = internalStorage.getEntityDefinition(this)
            const result = await connection.hGetAll(id)
            if (!isEmptyObject(result)) return undefined;
            return { id, value: result } as FindResult<T>
        }

        static async set<T extends Entity>(this: { new(): T }, id: string, value: Partial<T>) {
            const { connection } = internalStorage.getEntityDefinition(this)
            const result = await connection.hSet(id, Object.entries(JSON.parse(JSON.stringify(value))))
            if (!result) return undefined;
            return { id, value } as FindResult<T>
        }

        static async create<T extends Entity>(this: { new(): T }, value: T, id?: string) {
            const { schema } = internalStorage.getEntityDefinition(this)
            const hKey = id || `${schema.name}:${uuidv4()}`
            return await Repository.set.call(this, hKey, value) as FindResult<T>
        }

        static async delete<T extends Entity>(this: { new(): T }, id: string) {
            const { connection } = internalStorage.getEntityDefinition(this)
            return await connection.del(id)
        }

        static async find<T extends Entity>(this: { new(): T }, { where, options }: FindOptions<T>) {
            const { connection, schema } = internalStorage.getEntityDefinition(this)
            const query = convertWhere(
                schema,
                ...(Array.isArray(where) ? where : [where])
            )
            const { documents } = await connection.ft.search(schema.index, query, {
                SORTBY: options?.sortby,
                LIMIT: options?.limit
            })
            return documents as FindResult<T>[]
        }

        static async findOne<T extends Entity>(this: { new(): T }, { where, options }: FindOneOptions<T>) {
            const [result] = await Repository.find.call(this, {
                where, options: { ...options, limit: { from: options?.limit.from || 0, size: 1 } }
            })
            return result as FindResult<T> | undefined
        }
    }
}
