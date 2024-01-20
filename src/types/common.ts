export type ExclusiveKeys<T extends {}, Key = { [K in keyof T]: { [P in keyof T]?: P extends K ? T[P] : never } }> = Key[keyof Key];

export type PrimitiveValue = string | number | boolean
