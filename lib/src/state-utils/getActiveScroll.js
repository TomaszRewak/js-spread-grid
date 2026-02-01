/** @import * as Types from '../typings.js' */

/**
 * @param {Types.ScrollSpeed[] | number} speed
 * @param {number} distance
 * @returns {number|null}
 */
function getSpeedValue(speed, distance) {
    if (!speed)
        return null;

    if (typeof speed === 'number')
        return speed;

    for (const entry of speed) {
        if (distance <= entry.maxDistance)
            return entry.pixelsPerSecond;
    }

    return null;
}

/**
 * @param {Types.ScrollTarget} scrollTarget
 * @param {Types.MeasuredRow[]} measuredRows
 * @param {Types.Pinning} pinning
 * @param {Types.Position} internalMousePosition
 * @param {Types.FixedSize} fixedSize
 * @param {Types.TotalSize} totalSize
 * @param {Types.ClientSize} clientSize
 * @param {Types.ScrollOffset} scrollOffset
 * @param {number} borderWidth
 * @param {number} snapVersion
 * @returns {Types.ActiveScroll}
 */
export function getActiveVerticalScroll(scrollTarget, measuredRows, pinning, internalMousePosition, fixedSize, totalSize, clientSize, scrollOffset, borderWidth, snapVersion) {
    if (!scrollTarget)
        return null;

    const disableOnHover = 'disableOnHover' in scrollTarget ? scrollTarget.disableOnHover : true;

    if (disableOnHover && internalMousePosition &&
        internalMousePosition.y >= fixedSize.top &&
        internalMousePosition.y <= totalSize.height - fixedSize.bottom)
        return null;

    let index = Math.floor(scrollTarget.index) + pinning.top;
    let offset = -fixedSize.top;
    let rowHeight = 0;

    for (const row of measuredRows) {
        if (row.type === 'DYNAMIC-BLOCK') {
            const skipped = Math.min(index, row.count);
            offset += (row.rowHeight + borderWidth) * skipped;
            index -= skipped;

            if (skipped < row.count) {
                rowHeight = row.rowHeight;
                break;
            }
        } else {
            if (index === 0) {
                rowHeight = row.height;
                break;
            }

            offset += row.height + borderWidth;
            index -= 1;
        }
    }

    const position = scrollTarget.position || 'BEGIN';
    if (position === 'BEGIN')
        offset = offset;
    if (position === 'MIDDLE')
        offset = offset - (clientSize.height - fixedSize.top - fixedSize.bottom - rowHeight) / 2;
    if (position === 'END')
        offset = offset - (clientSize.height - fixedSize.top - fixedSize.bottom - rowHeight);

    const fractionalRow = scrollTarget.index % 1;
    offset += rowHeight * fractionalRow;

    const distance = Math.abs(offset - scrollOffset.top);
    const speed = getSpeedValue(scrollTarget.speed, distance);

    return {
        offset: Math.round(offset),
        speed,
        snapVersion
    };
}

/**
 * @param {Types.ScrollTarget} scrollTarget
 * @param {Types.MeasuredColumn[]} measuredColumns
 * @param {Types.Pinning} pinning
 * @param {Types.Position} internalMousePosition
 * @param {Types.FixedSize} fixedSize
 * @param {Types.TotalSize} totalSize
 * @param {Types.ClientSize} clientSize
 * @param {Types.ScrollOffset} scrollOffset
 * @param {number} borderWidth
 * @param {number} snapVersion
 * @returns {Types.ActiveScroll}
 */
export function getActiveHorizontalScroll(scrollTarget, measuredColumns, pinning, internalMousePosition, fixedSize, totalSize, clientSize, scrollOffset, borderWidth, snapVersion) {
    return null;
}