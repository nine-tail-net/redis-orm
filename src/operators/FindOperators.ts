
import { KeysOperatorTypes, Operator, OperatorTypes } from "../types"

export const Equal = createFindOperator("equal")
export const Not = createFindOperator("not")
// export const Or = createFindOperator("or")

function createFindOperator<S extends KeysOperatorTypes>(type: S) {
    return (value: OperatorTypes[S]) => new Operator<S>(value, type)
}
