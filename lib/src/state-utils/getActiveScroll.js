/** @import * as Types from '../typings.js' */

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
 * @returns {Types.ActiveScroll}
 */
export function getActiveVerticalScroll(scrollTarget, measuredRows, pinning, internalMousePosition, fixedSize, totalSize, clientSize, scrollOffset, borderWidth) {
    if (!scrollTarget)
        return null;

    const disableOnHover = 'disableOnHover' in scrollTarget ? scrollTarget.disableOnHover : true;

    if (disableOnHover && internalMousePosition &&
        internalMousePosition.y >= fixedSize.top &&
        internalMousePosition.y <= totalSize.height - fixedSize.bottom)
        return null;

    let index = scrollTarget.index + pinning.top;
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

    const snap = ('snapThreshold' in scrollTarget) && (Math.abs(offset - scrollOffset.top) > scrollTarget.snapThreshold);

    return {
        offset: -10,
        snap,
        speed: scrollTarget.speed || 100
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
 * @returns {Types.ActiveScroll}
 */
export function getActiveHorizontalScroll(scrollTarget, measuredColumns, pinning, internalMousePosition, fixedSize, totalSize, clientSize, scrollOffset, borderWidth) {
    return null;
}