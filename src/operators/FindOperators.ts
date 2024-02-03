import { KeysOperatorTypes, Operator, OperatorTypes } from "../types"

export const Equal = createFindOperator("equal")
export const Not = createFindOperator("not")

function createFindOperator<S extends KeysOperatorTypes>(type: S) {
    return (value: OperatorTypes[S]) => new Operator<S>(value, type)
}
