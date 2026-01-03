/**
 * @template {ResolvedDimension} T
 * @param {T[]} entries
 * @param {Key[]} order
 * @returns {T[]}
 */
function getOrdered(entries, order) {
    if (!order) {
        return entries;
    }

    const map = new Map();

    for (const entry of entries) {
        map.set(entry.key, entry);
    }

    const mixedResult = [];

    for (const key of order) {
        if (map.has(key)) {
            mixedResult.push(map.get(key));
            map.delete(key);
        }
    }

    for (const entry of entries) {
        if (map.has(entry.key)) {
            mixedResult.push(map.get(entry.key));
        }
    }

    return [
        ...mixedResult.filter(entry => entry.pinned === "BEGIN"),
        ...mixedResult.filter(entry => !entry.pinned),
        ...mixedResult.filter(entry => entry.pinned === "END")
    ]
}

/**
 * @param {ResolvedColumn[]} columns
 * @param {Key[]} order
 * @returns {ResolvedColumn[]}
 */
export function getOrderedColumns(columns, order) {
    return getOrdered(columns, order);
}

/**
 * @param {ResolvedRow[]} rows
 * @param {Key[]} order
 * @returns {ResolvedRow[]}
 */
export function getOrderedRows(rows, order) {
    return getOrdered(rows, order);
}