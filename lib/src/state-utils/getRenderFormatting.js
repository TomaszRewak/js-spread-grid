import stringifyId from '../core-utils/stringifyId.js';

function getHighlightColor(baseColor, isStrong) {
    if (isStrong)
        return baseColor + '99';
    else
        return baseColor + '33';
}

export default function getRenderFormatting(formatting, hoveredCell, focusedCell, selection, highlight, edition, sortBy, resizableColumn, resizableRow, borderWidth, isReordering, reorderedColumn, reorderedRow) {
    const focusedColumnKey = focusedCell ? stringifyId(focusedCell.columnId) : null;
    const focusedRowKey = focusedCell ? stringifyId(focusedCell.rowId) : null;
    const isResizingColumn = resizableColumn !== null;
    const isResizingRow = resizableRow !== null;
    const isResizing = isResizingColumn || isResizingRow;
    const selectionBorderWidth = borderWidth + 2;
    const resizableBorderWidth = borderWidth + 4;

    const isSelected = (rows, columns, rowIndex, columnIndex) => {
        if (rowIndex < 0 || rowIndex >= rows.length)
            return false;
        if (columnIndex < 0 || columnIndex >= columns.length)
            return false;

        const rowKey = rows[rowIndex].key;
        const columnKey = columns[columnIndex].key;

        return selection.isKeySelected(rowKey, columnKey);
    };

    const optional = (condition, style) => {
        if (condition)
            return [style];
        else
            return [];
    }

    return [
        {
            column: { type: 'DATA' },
            row: { type: 'FILTER' },
            style: ({ newValue }) => ({ background: '#FBFBFB', foreground: newValue ? 'black' : '#cccccc', border: { width: 1, color: 'gray' } })
        },
        {
            column: { type: 'FILTER' },
            row: { type: 'DATA' },
            style: ({ newValue }) => ({ background: '#FBFBFB', foreground: newValue ? 'black' : '#cccccc', border: { width: 1, color: 'gray' } })
        },
        {
            column: { type: 'ANY' },
            row: { type: 'HEADER' },
            style: { background: '#F5F5F5', border: { width: borderWidth, color: 'gray' } }
        },
        {
            column: { type: 'HEADER' },
            row: { type: 'ANY' },
            style: { background: '#F5F5F5', border: { width: borderWidth, color: 'gray' } }
        },
        {
            column: { type: 'HEADER' },
            row: { type: 'HEADER' },
            style: { background: '#E0E0E0' }
        },
        ...formatting,
        // TODO: optionally re-enable
        // ...optional(hoveredCell && !isResizingColumn, {
        //     column: { id: hoveredCell?.columnId },
        //     row: { type: 'ANY' },
        //     style: { highlight: '#81948133' },
        // }),
        ...optional(hoveredCell && !isResizingRow, {
            column: { type: 'ANY' },
            row: { id: hoveredCell?.rowId },
            style: { highlight: '#81948133' },
        }),
        ...optional(hoveredCell && !isResizing, {
            column: { id: hoveredCell?.columnId },
            row: { id: hoveredCell?.rowId },
            style: { highlight: '#81948188' },
        }),
        {
            column: { type: 'ANY' },
            row: { type: 'ANY' },
            condition: ({ rows, columns, row, column }) => isSelected(rows, columns, row.index, column.index),
            style: ({ rows, columns, row, column, edit }) => ({
                ...(!isSelected(rows, columns, row.index - 1, column.index) ? { borderTop: { width: selectionBorderWidth, color: '#596959', index: Number.MAX_SAFE_INTEGER } } : {}),
                ...(!isSelected(rows, columns, row.index + 1, column.index) ? { borderBottom: { width: selectionBorderWidth, color: '#596959', index: Number.MAX_SAFE_INTEGER } } : {}),
                ...(!isSelected(rows, columns, row.index, column.index - 1) ? { borderLeft: { width: selectionBorderWidth, color: '#596959', index: Number.MAX_SAFE_INTEGER } } : {}),
                ...(!isSelected(rows, columns, row.index, column.index + 1) ? { borderRight: { width: selectionBorderWidth, color: '#596959', index: Number.MAX_SAFE_INTEGER } } : {}),
                highlight: getHighlightColor(edit ? '#798d9c' : '#819481', focusedColumnKey !== column.key || focusedRowKey !== row.key)
            }),
        },
        {
            column: { type: 'ANY' },
            row: { type: 'ANY' },
            condition: ({ row, column }) => highlight.isKeySelected(row.key, column.key),
            style: ({ row, column }) => ({
                highlight: getHighlightColor('#93a8b8', focusedColumnKey !== column.key || focusedRowKey !== row.key)
            })
        },
        ...optional(focusedCell, {
            column: { id: focusedCell?.columnId },
            row: { id: focusedCell?.rowId },
            style: { highlight: '#ffffffaa' }
        }),
        ...sortBy.map(({ columnId, rowId, direction }, index) => ({
            column: { id: columnId },
            row: { id: rowId },
            style: { highlight: '#0377fc44' }
        })),
        {
            column: { type: 'ANY' },
            row: { type: 'ANY' },
            condition: ({ edit }) => edit,
            style: { corner: '#77777720' },
        },
        {
            column: { type: 'ANY' },
            row: { type: 'ANY' },
            condition: ({ row, column }) => edition.hasValueByKey(row.key, column.key),
            style: { corner: 'darkgreen' },
        },
        ...optional(resizableColumn, {
            column: { id: resizableColumn },
            row: { type: 'HEADER' },
            style: { borderRight: { width: resizableBorderWidth, color: 'cornflowerblue' } }
        }),
        ...optional(resizableRow, {
            column: { type: 'HEADER' },
            row: { id: resizableRow },
            style: { borderBottom: { width: resizableBorderWidth, color: 'cornflowerblue' } }
        }),
        ...optional(isReordering && reorderedColumn, {
            column: { id: reorderedColumn },
            row: { type: 'ANY' },
            style: { highlight: '#3a74e055' },
        }),
        ...optional(isReordering && reorderedRow, {
            column: { type: 'ANY' },
            row: { id: reorderedRow },
            style: { highlight: '#3a74e055' },
        }),
    ];
}