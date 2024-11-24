export type PropertyOption =
    | { type: "text", }
    | { type: "numeric", sortable?: true | 'UNF', noindex?: true }
    | { type: "tag" }

export type PropertyMetadata = {
    object: object,
    propertyName: string,
    options: PropertyOption
}
