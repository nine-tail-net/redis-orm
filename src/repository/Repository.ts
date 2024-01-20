import { internalStorage } from "../internalStorage"

export function Repository<Entity extends new (...args: any[]) => any>(entity: Entity) {
    return class Repository extends entity {
        // static find<T>(this: { new(): T }, options: FindOptions<T>): T {
        //     const { connection } = internalStorage.getEntityDefinition(this, super.name)
        // }
        
        //....
    }
}
