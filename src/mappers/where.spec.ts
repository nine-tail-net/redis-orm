import * as RedisTypes from "redis"
import { Schema as schema, WhereOptions } from "../types"
import { convertWhere } from "./where"
import { Not, Equal, Like } from "../operators/FindOperators"

type Cases = {
    input: WhereOptions | WhereOptions[]
    output: string
}

const schema: schema = {
    name: "test",
    index: `idx:test`,
    properties: {
        test: { type: RedisTypes.SchemaFieldTypes.TEXT },
        name: { type: RedisTypes.SchemaFieldTypes.TEXT },
        taskId: { type: RedisTypes.SchemaFieldTypes.TAG }
    },
    options: {
        ON: "HASH",
        PREFIX: "test:"
    }
}

const cases: Cases[] = [
    {
        input: {
            taskId: 'task:9461dfe9-41f7-4a04-bc1c-ce2e3855d00f',
            name: undefined,
        },
        output: "@taskId:{task\\:9461dfe9\\-41f7\\-4a04\\-bc1c\\-ce2e3855d00f}"

    },
    {
        input: {
            test: Like("hello world"),
            taskId: Not(Equal("task:9461dfe9-41f7-4a04-bc1c-ce2e3855d00f")),
        },
        output: "@test:(hello world) -@taskId:{task\\:9461dfe9\\-41f7\\-4a04\\-bc1c\\-ce2e3855d00f}"

    },
    {
        input: [
            { name: Like("pika") },
            { name: Not(Like("Dazai")) }
        ],
        output: "@name:(pika) | -@name:(Dazai)"

    }
]

describe("convert where to filter", () => {
    cases.forEach(({ input, output }) =>
        it("input to Equal output", () => {
            const result = convertWhere(schema, ...(Array.isArray(input) ? input : [input]))
            console.log(result)
            expect(result).toEqual(output)
        })
    )
})
