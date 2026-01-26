import stringifyId from "../core-utils/stringifyId.js";

/**
 * @param {ResolvedDimension[]} elements
 * @returns {boolean}
 */
function hasDynamicBlocks(elements) {
    return elements.some(element => element.type === 'DYNAMIC-BLOCK');
}

/**
 * @param {Data} data
 * @param {MeasuredColumn[]} columns
 * @param {Pinning} pinning
 * @param {Rect} scrollRect
 * @param {number} borderWidth
 * @returns {MeasuredStaticColumn[]}
 */
export function getStaticColumns(data, columns, pinning, scrollRect, borderWidth) {
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
 * @param {number} borderWidth
 * @returns {MeasuredStaticRow[]}
 */
export function getStaticRows(data, rows, pinning, scrollRect, borderWidth) {
    if (!hasDynamicBlocks(rows))
        return rows;

    const totalRows = rows.reduce((v, e) => v + (e.type === 'DYNAMIC-BLOCK' ? e.count : 1), 0);

    /** @type {MeasuredStaticRow[]} */
    const staticRows = [];
    let top = borderWidth;
    let currentRow = 0;
    let separators = 0;

    const addRow = (/** @type {number} */ count, /** @type {MeasuredStaticRow} */ row) => {
        staticRows.push(row);
        top += row.height + borderWidth;
        currentRow += count;
    }

    for (const row of rows) {

        if (row.type !== 'DYNAMIC-BLOCK') {
            addRow(1, row);
        } else {
            let dynamicOffset = 0;

            const rowSpan = row.rowHeight + borderWidth;
            const makeRow = () => {
                const selector = row.selector({ data, index: dynamicOffset });
                const id = row.id({ data, selector });
                const key = stringifyId(id);
                const header = row.header({ data, selector }); // TODO: optional

                dynamicOffset++;

                return {
                    ...row,
                    type: /** @type {StaticDimensionType} */ ('DATA'),
                    id,
                    key,
                    selector,
                    header,
                    height: row.rowHeight,
                }
            }

            while (dynamicOffset < row.count && currentRow < pinning.top) {
                addRow(1, makeRow());
            }

            const hiddenTop = Math.max(0, Math.floor((top - scrollRect.top) / rowSpan));
            if (hiddenTop > 0) {
                const id = `__separate${separators++}`
                addRow(hiddenTop, {
                    ...row,
                    type: 'SEPARATOR',
                    id: id,
                    key: stringifyId(id),
                    height: row.rowHeight * hiddenTop + borderWidth * (hiddenTop - 1),
                    header: ''
                });
            }

            while (dynamicOffset < row.count && top < scrollRect.top + scrollRect.height) {
                addRow(1, makeRow())
            }





            // const row = next.row;
            const bottom = top + row.rowHeight;
            const inView =
                currentRow < pinning.top ||
                currentRow >= totalRows - pinning.bottom ||
                top <= scrollRect.top + scrollRect.height &&
                bottom >= scrollRect.top

            if (inView) {
                const selector = row.selector({ data, index: next.dynamicOffset });
                const id = row.id({ data, selector });
                const key = stringifyId(id);
                const header = row.header({ data, selector }); // TODO: optional

                staticRows.push({
                    ...row,
                    type: /** @type {StaticDimensionType} */('DATA'),
                    id,
                    key,
                    selector,
                    header,
                    height: row.rowHeight,
                })

                top += row.rowHeight + borderWidth;
                next = { dynamicOffset: next.dynamicOffset + 1, row };

                if (next.dynamicOffset === row.count)
                    next = null;
            } else {

            }
        }
    }

    return staticRows;
}