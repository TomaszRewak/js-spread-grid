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
        return columns;

    const staticColumns = [];

    for (const column of columns) {
        if (column.type === 'DYNAMIC-BLOCK') {
            staticColumns.push({
                ...column,
            });
            staticColumns.push({
                ...column,
                type: /** @type {DimensionType} */('DATA'),
                id: 123,
                key: '123',
                width: column.columnWidth,
            });
            staticColumns.push({
                ...column,
                type: /** @type {DimensionType} */('DATA'),
                id: 456,
                key: '456',
                width: column.columnWidth,
            });
            staticColumns.push({
                ...column,
            });
        } else {
            staticColumns.push(column);
        }
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