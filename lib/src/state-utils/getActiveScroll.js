/** @import * as Types from '../typings.js' */

// TODO: move to the scroll.js and allow for specyfying number|ScrollBehavior as the last element of the array for default
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
 * @param {number} internalMousePosition
 * @param {number} fixedBegin
 * @param {number} fixedEnd
 * @param {number} totalSize
 * @returns {boolean}
 */
function isScrollEnabled(scrollTarget, internalMousePosition, fixedBegin, fixedEnd, totalSize) {
    if (!scrollTarget)
        return false;
    if (internalMousePosition === undefined)
        return true;
    if (internalMousePosition < fixedBegin)
        return true;
    if (internalMousePosition > totalSize - fixedEnd)
        return true;
    if ('disableOnHover' in scrollTarget && !scrollTarget.disableOnHover)
        return true;

    return false;
}

/**
 * @param {Types.ScrollTarget} scrollTarget
 * @param {number} elementOffset
 * @param {number} elementSize
 * @param {number} scrollAreaSize
 * @returns {number}
 */
function getTargetOffset(scrollTarget, elementOffset, elementSize, scrollAreaSize) {
    const position = scrollTarget.position || 'BEGIN';
    const fractionalOffset = (scrollTarget.index % 1) * elementSize;

    if (position === 'BEGIN')
        return elementOffset + fractionalOffset;
    if (position === 'MIDDLE')
        return elementOffset - (scrollAreaSize - elementSize) / 2 + fractionalOffset;
    if (position === 'END')
        return elementOffset - (scrollAreaSize - elementSize) + fractionalOffset;

    throw new Error(`Invalid scroll position: ${position}`);
}

/**
 * @param {Types.ScrollTarget} scrollTarget
 * @param {number} elementOffset
 * @param {number} elementSize
 * @param {number} scrollAreaSize
 * @param {number} scrollOffset
 * @param {number} snapVersion
 * @returns {Types.ActiveScroll}
 */
function getActiveScroll(scrollTarget, elementOffset, elementSize, scrollAreaSize, scrollOffset, snapVersion) {
    const targetOffset = getTargetOffset(scrollTarget, elementOffset, elementSize, scrollAreaSize);
    const distance = Math.abs(targetOffset - scrollOffset);
    const speed = getSpeedValue(scrollTarget.speed, distance);

    return {
        offset: Math.round(targetOffset),
        speed,
        snapVersion
    };
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
    if (!isScrollEnabled(scrollTarget, internalMousePosition?.y, fixedSize.top, fixedSize.bottom, totalSize.height))
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

    return getActiveScroll(scrollTarget, offset, rowHeight, clientSize.height - fixedSize.top - fixedSize.bottom, scrollOffset.top, snapVersion);
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
    if (!isScrollEnabled(scrollTarget, internalMousePosition?.x, fixedSize.left, fixedSize.right, totalSize.width))
        return null;

    let index = Math.floor(scrollTarget.index) + pinning.left;
    let offset = -fixedSize.left;
    let columnWidth = 0;

    for (const column of measuredColumns) {
        if (column.type === 'DYNAMIC-BLOCK') {
            const skipped = Math.min(index, column.count);
            offset += (column.columnWidth + borderWidth) * skipped;
            index -= skipped;

            if (skipped < column.count) {
                columnWidth = column.columnWidth;
                break;
            }
        } else {
            if (index === 0) {
                columnWidth = column.width;
                break;
            }

            offset += column.width + borderWidth;
            index -= 1;
        }
    }

    return getActiveScroll(scrollTarget, offset, columnWidth, clientSize.width - fixedSize.left - fixedSize.right, scrollOffset.left, snapVersion);
}