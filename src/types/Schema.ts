import { EntityOptions } from ".";
import { SchemaProperty } from "./SchemaProperty";

export type Schema = {
    name: string;
    index: `idx:${string}`;
    properties: {
        [key: string]: { [k: string]: any; } & {
            type: SchemaProperty
        }
    };
    options: {
        ON: EntityOptions["type"];
        PREFIX: `${string}:`
    };
};
