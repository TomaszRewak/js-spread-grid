/**
 * @param {number} index
 * @param {number} length
 * @param {number} pinnedBegin
 * @param {number} pinnedEnd
 */
export default function getPinned(index, length, pinnedBegin, pinnedEnd) {
    if (index < pinnedBegin)
        return "BEGIN";
    if (index >= length - pinnedEnd)
        return "END";
    return undefined;
}
