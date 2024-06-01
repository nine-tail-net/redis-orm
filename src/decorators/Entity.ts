import { EntityOptions } from "../types/Entity";
import { internalStorage } from "../internalStorage";

export function Entity<T extends new (...args: any[]) => object>(option: EntityOptions) {
    return (constructor: T) => {
        internalStorage.pushEntityOptions(constructor, option)
    }
}
