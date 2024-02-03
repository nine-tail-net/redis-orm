import { EntityOptions } from ".";
import { SchemaProperty } from "./SchemaProperty";

export type Schema = {
    name: string;
    index: `idx:${string}`;
    properties: { [key: string]: SchemaProperty };
    options: {
        ON: EntityOptions["type"];
        PREFIX: `${string}:`
    };
};
