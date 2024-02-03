import * as RedisTypes from "redis"
import { Schema as schema, WhereOptions } from "../types"
import { convertWhere } from "./where"
import { Not, Equal } from "../operators/FindOperators"

type Cases = {
    input: WhereOptions | WhereOptions[]
    output: string
}

const schema: schema = {
    name: "test",
    index: `idx:test`,
    properties: {
        test: RedisTypes.SchemaFieldTypes.TEXT,
        name: RedisTypes.SchemaFieldTypes.TEXT
    },
    options: {
        ON: "HASH",
        PREFIX: "test:"
    }
}

const cases: Cases[] = [
    {
        input: {
            test: "hello world",
            name: Not(Equal("pika"))
        },
        output: "@test:(hello world) -@name:(pika)"

    },
    {
        input: [
            { name: Equal("pika") },
            { name: Not(Equal("Dazai")) }
        ],
        output: "@name:(pika) | -@name:(Dazai)"

    }
]

describe("convert where to filter", () => {
    cases.forEach(({ input, output }) =>
        it("input to Equal output", () => {
            const result = convertWhere(schema, ...(Array.isArray(input) ? input : [input]))
            expect(result).toEqual(output)
        })
    )
})
