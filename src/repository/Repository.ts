import { v4 as uuidv4 } from 'uuid';
import { internalStorage } from "../internalStorage"
import { convertWhere } from "../mappers/where"
import { FindOneOptions, FindOptions, FindResult } from "../types"
import { isEmptyObject } from "../utils";

// <Entity extends RootEntity = RootEntity, Class = { new(): Entity }>(this: Class,
export type BaseEntityClassType<Entity extends object> = {
    new(...args: any[]): Entity;
    get<CEntity extends Entity, Class extends { new(): CEntity }>(this: Class, id: string): Promise<FindResult<CEntity> | undefined>
    set<CEntity extends Entity, Class extends { new(): CEntity }>(this: Class, id: string, value: Partial<CEntity>): Promise<FindResult<CEntity> | undefined>
    create<CEntity extends Entity, Class extends { new(): CEntity }>(this: Class, value: CEntity, id?: string): Promise<FindResult<CEntity>>
    delete<CEntity extends Entity, Class extends { new(): CEntity }>(this: Class, id: string): Promise<number>
    find<CEntity extends Entity, Class extends { new(): CEntity }>(this: Class, options: FindOptions<CEntity>): Promise<FindResult<CEntity>[]>
    findOne<CEntity extends Entity, Class extends { new(): CEntity }>(this: Class, options: FindOneOptions<CEntity>): Promise<FindResult<CEntity> | undefined>
}

export function getRepository<Entity extends object>(base: new (...args: any[]) => Entity): BaseEntityClassType<Entity> {
    return class Repository extends base {
        static async get<CEntity extends Entity>(id: string) {
            const { connection } = internalStorage.getEntityDefinition(this)
            const result = await connection.hGetAll(id)
            if (!isEmptyObject(result)) return undefined;
            return { id, value: result } as FindResult<CEntity>
        }

        static async set<CEntity extends Entity>(id: string, value: Partial<Entity>) {
            const { connection } = internalStorage.getEntityDefinition(this)
            const result = await connection.hSet(id, Object.entries(JSON.parse(JSON.stringify(value))))
            if (!result) return undefined;
            return { id, value } as FindResult<CEntity>
        }

        static async create<CEntity extends Entity>(value: Entity, id?: string) {
            const { schema } = internalStorage.getEntityDefinition(this)
            const hKey = id || `${schema.name}:${uuidv4()}`
            return await Repository.set.call(this, hKey, value) as FindResult<CEntity>
        }

        static async delete(id: string) {
            const { connection } = internalStorage.getEntityDefinition(this)
            return await connection.del(id)
        }

        static async find<CEntity extends Entity>({ where, options }: FindOptions<Entity>) {
            const { connection, schema } = internalStorage.getEntityDefinition(this)
            const query = convertWhere(
                schema,
                ...(Array.isArray(where) ? where : [where])
            )
            const { documents } = await connection.ft.search(schema.index, query, {
                SORTBY: options?.sortby,
                LIMIT: options?.limit
            })
            return documents as FindResult<CEntity>[]
        }

        static async findOne<CEntity extends Entity>({ where, options }: FindOneOptions<Entity>) {
            const [result] = await Repository.find.call(this, {
                where, options: { ...options, limit: { from: options?.limit.from || 0, size: 1 } }
            })
            return result as FindResult<CEntity> | undefined
        }
    }
}
