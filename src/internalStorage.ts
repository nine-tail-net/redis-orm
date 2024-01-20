import { EntityDefinition, PropertyMetadata, PropertyOption } from "./types";
import { EntityOptions } from "./types";

class InternalStorage {
    entityMetadata = new WeakMap<object, EntityOptions>()
    propertiesMetadata: PropertyMetadata[] = []
    entityDefinition = new WeakMap<object, EntityDefinition>()

    pushEntityOptions(target: object, options: EntityOptions) {
        this.entityMetadata.set(target, options);
    }

    pushColumnOptions(object: object, propertyName: string, options: PropertyOption) {
        this.propertiesMetadata.push({
            object, propertyName, options
        });
    }

    getEntityWorkspace(target: object) {
        return {
            entityOptions: this.entityMetadata.get(target),
            propertyMetadata: this.propertiesMetadata.filter(property => target == property.object.constructor),
        }
    }

    pushEntityDefinition(object: object, definition: EntityDefinition) {
        this.entityDefinition.set(object, definition)
    }

    getEntityDefinition(object: object, originalEntityName?: string) {
        const EntityDefinition = this.entityDefinition.get(object)
        if (!EntityDefinition)
            throw new Error(`Entity definition not found` + originalEntityName ? ` for the: ${originalEntityName}` : "")
        return EntityDefinition
    }
}

export const internalStorage = new InternalStorage
