import { WhereOptions } from "./Where";
import { SearchOptions } from "redis";

type options = {
    limit?: SearchOptions["LIMIT"]
    sortby?: SearchOptions["SORTBY"]
}

export type FindOptions<T> = {
    where: WhereOptions<T> | WhereOptions<T>[]
    options?: options
}

export type FindOneOptions<T> = {
    where: WhereOptions<T> | WhereOptions<T>[]
    options?: Omit<options, "limit"> & { limit: { from: number } }
}

export type FindResult<T = object> = {
    id: string
    value: T
}
