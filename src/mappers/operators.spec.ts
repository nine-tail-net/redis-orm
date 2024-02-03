import { SchemaFieldTypes } from "redis"
import { Operators } from "../types"
import { Equal, Not } from "../operators/FindOperators"
import { OperatorMapper } from "./operators"
import { SchemaPropertyType } from "../types/SchemaProperty"

type Cases = {
    input: {
        propertyName: string,
        operator: Operators,
        propertyType: SchemaPropertyType
    }
    output: string
}

const cases: Cases[] = [
    {
        input: {
            propertyName: "name",
            operator: Equal("Dazai"),
            propertyType: SchemaFieldTypes.TEXT
        },
        output: "@name:(Dazai)"
    },
    {
        input: {
            propertyName: "name",
            operator: Not(Equal("Dazai")),
            propertyType: SchemaFieldTypes.TEXT
        },
        output: "-@name:(Dazai)"
    },
    {
        input: {
            propertyName: "age",
            operator: Equal(15),
            propertyType: SchemaFieldTypes.NUMERIC
        },
        output: "@age:[15 15]"
    },
    {
        input: {
            propertyName: "age",
            operator: Not(Equal(15)),
            propertyType: SchemaFieldTypes.NUMERIC
        },
        output: "-@age:[15 15]"
    },
]

describe("convert operator to filter", () => {
    cases.forEach(({ input, output }) =>
        it("input to Equal output", () => {
            const result = OperatorMapper(input.operator, input.propertyName, input.propertyType)
            expect(result).toEqual(output)
        })
    )
})
