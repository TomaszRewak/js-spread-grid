import stringifyId from "../core-utils/stringifyId.js";

/**
 * @param {ResolvedDimension[]} elements
 * @returns {boolean}
 */
function hasDynamicBlocks(elements) {
    return elements.some(element => element.type === 'DYNAMIC-BLOCK');
}

/**
 * @param {[number, number][]} ranges
 * @returns {[number, number][]}
 */
function mergeRanges(ranges) {
    /** @type {[number, number][]} */
    const merged = [];

    for (const [start, end] of ranges) {
        if (start > end) {
            continue;
        }

        if (merged.length === 0) {
            merged.push([start, end]);
            continue;
        }

        const [prevStart, prevEnd] = merged[merged.length - 1];

        if (prevEnd < start - 1) {
            merged.push([start, end]);
        } else {
            merged.pop();
            merged.push([prevStart, end]);
        }
    }

    return merged;
}

/**
 * @param {(ResolvedStaticDimension | ResolvedDynamicDimension)[]} elements
 * @returns {number}
 */
function countStaticElements(elements) {
    return elements.reduce((sum, element) => {
        if (element.type === 'DYNAMIC-BLOCK')
            return sum + element.count;
        else
            return sum + 1;
    }, 0);
}

/**
 * @param {string} message
 */
function log(message) {
    //console.log(message);
}

/**
 * @param {Data} data
 * @param {MeasuredColumn[]} columns
 * @param {Pinning} pinning
 * @param {Rect} scrollRect
 * @param {FixedSize} fixedSize
 * @param {number} borderWidth
 * @returns {MeasuredStaticColumn[]}
 */
export function getStaticColumns(data, columns, pinning, scrollRect, fixedSize, borderWidth) {
    if (!hasDynamicBlocks(columns))
        return /** @type {MeasuredStaticColumn[]} */ (columns);

    let currentLeft = borderWidth;
    let globalColumnIndex = 0;
    let separatorCount = 0;

    const totalColumnCount = countStaticElements(columns);
    const absoluteScrollLeft = scrollRect.left + fixedSize.left;
    const absoluteScrollRight = absoluteScrollLeft + scrollRect.width;
    const staticColumns = /** @type {MeasuredStaticColumn[]} */ ([]);
    const addColumn = (/** @type {number} */ snap, /** @type {MeasuredStaticColumn} */ column) => {
        staticColumns.push(column);
        currentLeft += column.width + borderWidth;
        globalColumnIndex += snap;
    }
    const addStaticColumn = (/** @type {MeasuredStaticColumn} */ column) => {
        addColumn(1, column);
    }
    const addDataColumns = (/** @type {MeasuredDynamicColumn} */ column, /** @type {number} */ start, /** @type {number} */ end) => {
        for (let index = start; index <= end; index++) {
            const selector = column.selector({ data, index });
            const id = column.id({ data, selector });
            addColumn(1, {
                ...column,
                type: /** @type {StaticDimensionType} */ ('DATA'),
                id,
                key: stringifyId(id),
                selector,
                header: column.header({ data, selector }),
                width: column.columnWidth,
            });
        }
    }
    const addSeparator = (/** @type {MeasuredDynamicColumn} */ column, /** @type {number} */ span) => {
        if (span > 0) {
            const id = `__separator_${separatorCount++}`;
            addColumn(span, {
                ...column,
                type: /** @type {StaticDimensionType} */ ('SEPARATOR'),
                id,
                key: stringifyId(id),
                header: '',
                width: span * column.columnWidth + (span - 1) * borderWidth,
            });
        }
    }

    for (const column of columns) {
        if (column.type !== 'DYNAMIC-BLOCK') {
            addStaticColumn(column);
            continue;
        }

        const { count, columnWidth } = column;
        const columnSpan = columnWidth + borderWidth;
        const leftPinnedEnd = pinning.left - globalColumnIndex;
        const rightPinnedStart = totalColumnCount - pinning.right - globalColumnIndex;
        const rawFirstVisible = Math.floor((absoluteScrollLeft - currentLeft) / columnSpan);
        const rawLastVisible = Math.floor((absoluteScrollRight - currentLeft) / columnSpan);
        const firstVisibleIndex = Math.max(0, leftPinnedEnd, rawFirstVisible);
        const lastVisibleIndex = Math.min(count - 1, rightPinnedStart - 1, rawLastVisible);

        const ranges = mergeRanges([
            [0, leftPinnedEnd - 1],
            [firstVisibleIndex, lastVisibleIndex],
            [rightPinnedStart, count - 1]
        ]);

        let index = 0;

        for (const [start, end] of ranges) {
            addSeparator(column, start - index);
            addDataColumns(column, start, end);
            index = end + 1;
        }
        addSeparator(column, count - index);
    }

    return staticColumns;
}

/**
 * @param {Data} data
 * @param {MeasuredRow[]} rows
 * @param {Pinning} pinning
 * @param {Rect} scrollRect
 * @param {FixedSize} fixedSize
 * @param {number} borderWidth
 * @returns {MeasuredStaticRow[]}
 */
export function getStaticRows(data, rows, pinning, scrollRect, fixedSize, borderWidth) {
    if (!hasDynamicBlocks(rows))
        return /** @type {MeasuredStaticRow[]} */ (rows);

    log(`-----------------`);

    let currentTop = borderWidth;
    let globalRowIndex = 0;
    let separatorCount = 0;

    const totalRowCount = countStaticElements(rows);
    const absoluteScrollTop = scrollRect.top + fixedSize.top;
    const absoluteScrollBottom = absoluteScrollTop + scrollRect.height;
    const staticRows = /** @type {MeasuredStaticRow[]} */ ([]);
    const addRow = (/** @type {number} */ snap, /** @type {MeasuredStaticRow} */ row) => {
        staticRows.push(row);
        currentTop += row.height + borderWidth;
        globalRowIndex += snap;
    }
    const addStaticRow = (/** @type {MeasuredStaticRow} */ row) => {
        log('static row');
        addRow(1, row);
    }
    const addDataRows = (/** @type {MeasuredDynamicRow} */ row, /** @type {number} */ start, /** @type {number} */ end) => {
        log(`data rows ${start} - ${end}`);
        for (let index = start; index <= end; index++) {
            const selector = row.selector({ data, index });
            const id = row.id({ data, selector });
            addRow(1, {
                ...row,
                type: /** @type {StaticDimensionType} */ ('DATA'),
                id,
                key: stringifyId(id),
                selector,
                header: row.header({ data, selector }),
                height: row.rowHeight,
            });
        }
    }
    const addSeparator = (/** @type {MeasuredDynamicRow} */ row, /** @type {number} */ span) => {
        log(`separator rows ${span}`);
        if (span > 0) {
            const id = `__separator_${separatorCount++}`;
            addRow(span, {
                ...row,
                type: /** @type {StaticDimensionType} */ ('SEPARATOR'),
                id,
                key: stringifyId(id),
                header: '',
                height: span * row.rowHeight + (span - 1) * borderWidth,
            });
        }
    }

    for (const row of rows) {
        if (row.type !== 'DYNAMIC-BLOCK') {
            addStaticRow(row);
            continue;
        }

        const { count, rowHeight } = row;
        const rowSpan = rowHeight + borderWidth;
        const topPinnedEnd = pinning.top - globalRowIndex;
        const bottomPinnedStart = totalRowCount - pinning.bottom - globalRowIndex;
        const rawFirstVisible = Math.floor((absoluteScrollTop - currentTop) / rowSpan);
        const rawLastVisible = Math.floor((absoluteScrollBottom - currentTop) / rowSpan);
        const firstVisibleIndex = Math.max(0, topPinnedEnd, rawFirstVisible);
        const lastVisibleIndex = Math.min(count - 1, bottomPinnedStart - 1, rawLastVisible);

        const ranges = mergeRanges([
            [0, topPinnedEnd - 1],
            [firstVisibleIndex, lastVisibleIndex],
            [bottomPinnedStart, count - 1]
        ]);

        let index = 0;

        for (const [start, end] of ranges) {
            addSeparator(row, start - index);
            addDataRows(row, start, end);
            index = end + 1;
        }
        addSeparator(row, count - index);
    }

    return staticRows;
}