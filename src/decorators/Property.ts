import "reflect-metadata";
import { PropertyOption } from "../types";
import { internalStorage } from "../internalStorage";

export function Property(option: PropertyOption) {
    return (target: any, propertyKey: string) => {
        internalStorage.pushColumnOptions(target, propertyKey, option)
    }
}
