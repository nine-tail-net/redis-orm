import { KeysOperatorTypes, Operator, WhereOptions } from "../types";
import { PrimitiveValue } from "../types/common";

type propertyFilter = {
    property: string,
    value: PrimitiveValue,
    type: Exclude<KeysOperatorTypes, "or">
}


/// todo 
export function convertToRedisQuery(): propertyFilter[] {
    const filters: propertyFilter[] = [];
    return filters
}

function isPrimitive(value: any) {
    const valueType = typeof value
    return valueType === "string"
        || valueType === "boolean"
        || valueType === "number"
}

// function convertToRedisQuery(where: Where[]): string {
//     const filters: string[] = [];

//     for (let key in where) {
//         const value = where[key];

//         if (!(typeof value === 'object')) {
//             filters.push(`@${key}:${value}`);
//         } else if ('$eq' in value) {
//             filters.push(`@${key}:${value['$eq']}`);
//         } else if ('$ne' in value) {
//             filters.push(`!@${key}:${value['$ne']}`);
//         } else if ('$gt' in value) {
//             filters.push(`@${key}:[${value['$gt']} +inf]`);
//         } else if ('$lt' in value) {
//             filters.push(`@${key}:[-inf ${value['$lt']}]`);
//         }
//     }

//     return filters.length == 0
//         ? "" : filters.join(' ');
// }
