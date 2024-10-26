/**
 * @template {{ key: Key }} T
 * @param {T[]} elements
 * @returns {Map<Key, T>}
 */
export default function getLookup(elements) {
    return elements.reduce((lookup, element) => lookup.set(element.key, element), new Map());
}
