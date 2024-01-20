
import { WhereOptions } from "../types"
import { convertToRedisQuery } from "./where"
import { Not, Equal } from "../operators/FindOperators"

type Cases = {
    input: WhereOptions
    output: string
}

const cases: Cases[] = [
    {
        input: {
            test: "hello world",
            name: Not(Equal("addd"))
        },
        output: `@test:("hello world") @age:(-"12121212")`
    }
]

describe("convert where to RedisQuery", () => {
    cases.forEach(({ input, output }) =>
        it("input to Equal output", () => {
            console.log(convertToRedisQuery(input))
        })
    )
})