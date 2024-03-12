import { Schema } from "../types";

export function wheresToRedisQuery(wheres: string[], schemaProperties: Schema["properties"]): string {
    let query: string[] = []
    for (let key in schemaProperties) {
        const properties = wheres.filter(i => i.includes(`@${key}:`))
        if (properties.length > 0)
            query.push(properties.join(" | "))
    }
    return query.join(" ")
}
