/**
 * @param {number} cursor
 * @param {number} size
 * @param {number} viewportSize
 * @param {number} marginBefore
 * @param {number} marginAfter
 * @returns {number}
 */
export default function getPopupPosition(cursor, size, viewportSize, marginBefore, marginAfter) {
    const position = cursor + marginAfter;
    if (position >= 0 && position + size <= viewportSize)
        return position;

    const flipped = cursor - size - marginBefore;
    if (flipped >= 0 && flipped + size <= viewportSize)
        return flipped;

    return Math.max(0, viewportSize - size);
}