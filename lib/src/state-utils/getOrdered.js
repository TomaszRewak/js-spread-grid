/** @import * as Types from "../typings.js"; */

/**
 * @param {number[]} a
 * @param {number[]} b
 * @returns number
 */
function compare(a, b) {
    if (a.length != b.length)
        throw new Error('lengths should be the same');

    for (let i = 0; i < a.length; i++) {
        const diff = a[i] - b[i];

        if (diff != 0)
            return diff;
    }

    return 0;
}

/**
 * @template {Types.ResolvedDimension} T
 * @param {T[]} entries
 * @param {Types.Key[]} order
 * @returns {T[]}
 */
function getOrdered(entries, order) {
    if (!order.length) {
        return entries;
    }

    /** @type {Map<Types.Key, number>} */
    const orderMap = new Map();
    for (const [index, key] of order.entries()) {
        orderMap.set(key, index);
    }

    /** @type {{entry: T, score: number[]}[]} */
    const scored = [];
    const maxOrder = order.length;
    let section = 0;
    for (const [index, entry] of entries.entries()) {
        if (entry.type === 'DYNAMIC-BLOCK') {
            section++;
            scored.push({ entry, score: [section, 0, 0] });
            section++;
        }
        else {
            const key = entry.key;
            const entryOrder = orderMap.has(key) ? orderMap.get(key) : maxOrder;
            scored.push({ entry, score: [section, entryOrder, index] });
        }
    }

    return scored.sort((a, b) => compare(a.score, b.score)).map(element => element.entry);
}

/**
 * @param {Types.ResolvedColumn[]} columns
 * @param {Types.Key[]} order
 * @returns {Types.ResolvedColumn[]}
 */
export function getOrderedColumns(columns, order) {
    return getOrdered(columns, order);
}

/**
 * @param {Types.ResolvedRow[]} rows
 * @param {Types.Key[]} order
 * @returns {Types.ResolvedRow[]}
 */
export function getOrderedRows(rows, order) {
    return getOrdered(rows, order);
}