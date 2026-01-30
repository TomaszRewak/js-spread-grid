/** @import * as Types from "../typings.js"; */

/**
 * @template {{ key: Types.Key }} T
 * @param {T[]} elements
 * @returns {Map<Types.Key, T>}
 */
export default function getLookup(elements) {
    return elements.reduce((lookup, element) => lookup.set(element.key, element), new Map());
}
