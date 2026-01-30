/**
 * @param {ResolvedDimension[]} entries
 * @returns {Set<Key>}
 */
export default function getKeys(entries) {
    const set = new Set();

    for (const entry of entries) {
        if (entry.type != 'DYNAMIC-BLOCK')
            set.add(entry.key);
    }

    return set;
}
