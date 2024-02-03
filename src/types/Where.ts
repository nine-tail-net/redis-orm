import { Operator } from "./Operator"

export type WhereOptions<T = object> = {
    [key in keyof T]?: Operator | T[key]
}
