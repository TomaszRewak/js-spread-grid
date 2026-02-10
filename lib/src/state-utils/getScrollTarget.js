/** @import * as Types from '../typings.js' */

// TODO: allow using id instead of index in scroll target

/**
 * @param {Types.ScrollTarget} scrollTarget
 * @param {boolean} disableScrollOnHover
 * @param {number} internalMousePosition
 * @param {number} fixedBegin
 * @param {number} fixedEnd
 * @param {number} totalSize
 * @returns {boolean}
 */
function isScrollEnabled(scrollTarget, disableScrollOnHover, internalMousePosition, fixedBegin, fixedEnd, totalSize) {
    if (!scrollTarget)
        return false;
    if (internalMousePosition === undefined)
        return true;
    if (internalMousePosition < fixedBegin)
        return true;
    if (internalMousePosition > totalSize - fixedEnd)
        return true;
    if (!disableScrollOnHover)
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
function getScrollTarget(scrollTarget, elementOffset, elementSize, scrollAreaSize) {
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
 * @param {boolean} disableScrollOnHover
 * @param {Types.MeasuredRow[]} measuredRows
 * @param {Types.Pinning} pinning
 * @param {Types.Position} internalMousePosition
 * @param {Types.FixedSize} fixedSize
 * @param {Types.TotalSize} totalSize
 * @param {Types.ClientSize} clientSize
 * @param {number} borderWidth
 * @returns {number | null}
 */
export function getVerticalScrollTarget(scrollTarget, disableScrollOnHover, measuredRows, pinning, internalMousePosition, fixedSize, totalSize, clientSize, borderWidth) {
    if (!isScrollEnabled(scrollTarget, disableScrollOnHover, internalMousePosition?.y, fixedSize.top, fixedSize.bottom, totalSize.height))
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

    return getScrollTarget(scrollTarget, offset, rowHeight, clientSize.height - fixedSize.top - fixedSize.bottom);
}

/**
 * @param {Types.ScrollTarget} scrollTarget
 * @param {boolean} disableScrollOnHover
 * @param {Types.MeasuredColumn[]} measuredColumns
 * @param {Types.Pinning} pinning
 * @param {Types.Position} internalMousePosition
 * @param {Types.FixedSize} fixedSize
 * @param {Types.TotalSize} totalSize
 * @param {Types.ClientSize} clientSize
 * @param {number} borderWidth
 * @returns {number | null}
 */
export function getHorizontalScrollTarget(scrollTarget, disableScrollOnHover, measuredColumns, pinning, internalMousePosition, fixedSize, totalSize, clientSize, borderWidth) {
    if (!isScrollEnabled(scrollTarget, disableScrollOnHover, internalMousePosition?.x, fixedSize.left, fixedSize.right, totalSize.width))
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

    return getScrollTarget(scrollTarget, offset, columnWidth, clientSize.width - fixedSize.left - fixedSize.right);
}