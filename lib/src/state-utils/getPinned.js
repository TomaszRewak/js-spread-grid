/**
 * @param {number} index
 * @param {number} length
 * @param {number} pinnedBegin
 * @param {number} pinnedEnd
 * @param {DimensionType} type
 * @returns {Pinned}
 */
export default function getPinned(index, length, pinnedBegin, pinnedEnd, type) {
    if (index < pinnedBegin) {
        if (type === 'DYNAMIC-BLOCK')
            throw new Error('DYNAMIC-BLOCK should have been unfolded before pinning');

        return "BEGIN";
    }

    if (index >= length - pinnedEnd) {
        if (type === 'DYNAMIC-BLOCK')
            throw new Error('DYNAMIC-BLOCK should have been unfolded before pinning');

        return "END";
    }

    return undefined;
}
