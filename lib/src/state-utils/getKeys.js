/** @import * as Types from "../typings.js"; */

/**
 * @param {Types.ResolvedDimension[]} entries
 * @returns {Set<Types.Key>}
 */
export default function getKeys(entries) {
    const set = new Set();

    for (const entry of entries) {
        if (entry.type != 'DYNAMIC-BLOCK')
            set.add(entry.key);
    }

    return set;
}
