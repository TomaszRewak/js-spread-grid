/**
 * @param {PlacedColumn[]} columns
 * @param {PlacedRow[]} rows
 */
export default function getSections(columns, rows) {
    const topLength = rows.filter(row => row.pinned === 'BEGIN').length; // TODO: optimize
    const bottomLength = rows.filter(row => row.pinned === 'END').length;
    const middleLength = rows.length - topLength - bottomLength;
    const leftLength = columns.filter(column => column.pinned === 'BEGIN').length;
    const rightLength = columns.filter(column => column.pinned === 'END').length;
    const centerLength = columns.length - leftLength - rightLength;

    const topRows = rows.slice(0, topLength);
    const bottomRows = rows.slice(rows.length - bottomLength, rows.length);
    const middleRows = rows.slice(topLength, rows.length - bottomLength);
    const leftColumns = columns.slice(0, leftLength);
    const rightColumns = columns.slice(columns.length - rightLength, columns.length);
    const centerColumns = columns.slice(leftLength, columns.length - rightLength);

    const hasTopRows = topLength > 0;
    const hasBottomRows = bottomLength > 0;
    const hasMiddleRows = middleLength > 0;
    const hasLeftColumns = leftLength > 0;
    const hasRightColumns = rightLength > 0;
    const hasCenterColumns = centerLength > 0;

    const topShowTopBorder = true;
    const topShowBottomBorder = true;
    const bottomShowTopBorder = hasMiddleRows || !hasTopRows;
    const bottomShowBottomBorder = true;
    const middleShowTopBorder = !hasTopRows;
    const middleShowBottomBorder = !hasBottomRows;
    const leftShowLeftBorder = true;
    const leftShowRightBorder = true;
    const rightShowLeftBorder = hasCenterColumns || !hasLeftColumns;
    const rightShowRightBorder = true;
    const centerShowLeftBorder = !hasLeftColumns;
    const centerShowRightBorder = !hasRightColumns;

    /**
     * @param {PlacedRow[]} rows
     * @param {boolean} showTopBorder
     * @param {boolean} showBottomBorder
     */
    const getHeight = (rows, showTopBorder, showBottomBorder) => {
        if (rows.length === 0)
            return 0;

        const top = showTopBorder ? rows.at(0).topWithBorder : rows.at(0).top;
        const bottom = showBottomBorder ? rows.at(-1).bottomWithBorder : rows.at(-1).bottom;

        return bottom - top;
    }

    /**
     * @param {PlacedColumn[]} columns
     * @param {boolean} showLeftBorder
     * @param {boolean} showRightBorder
     */
    const getWidth = (columns, showLeftBorder, showRightBorder) => {
        if (columns.length === 0)
            return 0;

        const left = showLeftBorder ? columns.at(0).leftWithBorder : columns.at(0).left;
        const right = showRightBorder ? columns.at(-1).rightWithBorder : columns.at(-1).right;

        return right - left;
    }

    const topHeight = getHeight(topRows, topShowTopBorder, topShowBottomBorder);
    const bottomHeight = getHeight(bottomRows, bottomShowTopBorder, bottomShowBottomBorder);
    const middleHeight = getHeight(middleRows, middleShowTopBorder, middleShowBottomBorder);
    const leftWidth = getWidth(leftColumns, leftShowLeftBorder, leftShowRightBorder);
    const rightWidth = getWidth(rightColumns, rightShowLeftBorder, rightShowRightBorder);
    const centerWidth = getWidth(centerColumns, centerShowLeftBorder, centerShowRightBorder);

    return {
        top: {
            rows: topRows,
            showTopBorder: topShowTopBorder,
            showBottomBorder: topShowBottomBorder,
            height: topHeight
        },
        bottom: {
            rows: bottomRows,
            showTopBorder: bottomShowTopBorder,
            showBottomBorder: bottomShowBottomBorder,
            height: bottomHeight
        },
        middle: {
            rows: middleRows,
            showTopBorder: middleShowTopBorder,
            showBottomBorder: middleShowBottomBorder,
            height: middleHeight
        },
        left: {
            columns: leftColumns,
            showLeftBorder: leftShowLeftBorder,
            showRightBorder: leftShowRightBorder,
            width: leftWidth
        },
        right: {
            columns: rightColumns,
            showLeftBorder: rightShowLeftBorder,
            showRightBorder: rightShowRightBorder,
            width: rightWidth
        },
        center: {
            columns: centerColumns,
            showLeftBorder: centerShowLeftBorder,
            showRightBorder: centerShowRightBorder,
            width: centerWidth
        }
    };
}