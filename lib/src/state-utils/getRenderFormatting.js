import stringifyId from '../core-utils/stringifyId.js';

function getHighlightColor(baseColor, isStrong) {
    if (isStrong)
        return baseColor + '99';
    else
        return baseColor + '33';
}

export default function getRenderFormatting(formatting, hoveredCell, focusedCell, selection, highlight, edition, resizableColumn, resizableRow) {
    const focusedColumnKey = focusedCell ? stringifyId(focusedCell.columnId) : null;
    const focusedRowKey = focusedCell ? stringifyId(focusedCell.rowId) : null;
    const isResizingColumn = resizableColumn !== null;
    const isResizingRow = resizableRow !== null;
    const isResizing = isResizingColumn || isResizingRow;

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
            column: { match: 'ANY' },
            row: { match: 'FILTER' },
            style: ({ newValue }) => ({ background: '#FBFBFB', foreground: newValue ? 'black' : '#cccccc', border: { width: 1, color: 'gray' } })
        },
        {
            column: { match: 'ANY' },
            row: { match: 'HEADER' },
            style: { background: '#F5F5F5', border: { width: 1, color: 'gray' } }
        },
        {
            column: { match: 'HEADER' },
            row: { match: 'ANY' },
            style: { background: '#F5F5F5', border: { width: 1, color: 'gray' } }
        },
        {
            column: { match: 'HEADER' },
            row: { match: 'HEADER' },
            style: { background: '#E0E0E0' }
        },
        ...formatting,
        ...optional(hoveredCell && !isResizingColumn, {
            column: { id: hoveredCell?.columnId },
            row: { match: 'ANY' },
            style: { highlight: '#81948133' },
        }),
        ...optional(hoveredCell && !isResizingRow, {
            column: { match: 'ANY' },
            row: { id: hoveredCell?.rowId },
            style: { highlight: '#81948133' },
        }),
        ...optional(hoveredCell && !isResizing, {
            column: { id: hoveredCell?.columnId },
            row: { id: hoveredCell?.rowId },
            style: { highlight: '#81948188' },
        }),
        {
            column: { match: 'ANY' },
            row: { match: 'ANY' },
            condition: ({ rows, columns, row, column }) => isSelected(rows, columns, row.index, column.index),
            style: ({ rows, columns, row, column, edit }) => ({
                ...(!isSelected(rows, columns, row.index - 1, column.index) ? { borderTop: { width: 3, color: '#596959', index: Number.MAX_SAFE_INTEGER } } : {}),
                ...(!isSelected(rows, columns, row.index + 1, column.index) ? { borderBottom: { width: 3, color: '#596959', index: Number.MAX_SAFE_INTEGER } } : {}),
                ...(!isSelected(rows, columns, row.index, column.index - 1) ? { borderLeft: { width: 3, color: '#596959', index: Number.MAX_SAFE_INTEGER } } : {}),
                ...(!isSelected(rows, columns, row.index, column.index + 1) ? { borderRight: { width: 3, color: '#596959', index: Number.MAX_SAFE_INTEGER } } : {}),
                highlight: getHighlightColor(edit ? '#798d9c' : '#819481', focusedColumnKey !== column.key || focusedRowKey !== row.key)
            }),
        },
        {
            column: { match: 'ANY' },
            row: { match: 'ANY' },
            condition: ({ row, column }) => highlight.isKeySelected(row.key, column.key),
            style: ({ row, column }) => ({
                highlight: getHighlightColor('#93a8b8', focusedColumnKey !== column.key || focusedRowKey !== row.key)
            })
        },
        ...optional(focusedCell, {
            column: { id: focusedCell?.columnId },
            row: { id: focusedCell?.rowId },
            style: { highlight: 'white' }
        }),
        {
            column: { match: 'ANY' },
            row: { match: 'ANY' },
            condition: ({ edit }) => edit,
            style: { corner: '#77777720' },
        },
        {
            column: { match: 'ANY' },
            row: { match: 'ANY' },
            condition: ({ row, column }) => edition.hasValueByKey(row.key, column.key),
            style: { corner: 'darkgreen' },
        },
        ...optional(resizableColumn, {
            column: { id: resizableColumn },
            row: { match: 'HEADER' },
            style: { borderRight: { width: 5, color: 'cornflowerblue' } }
        }),
        ...optional(resizableRow, {
            column: { match: 'HEADER' },
            row: { id: resizableRow },
            style: { borderBottom: { width: 5, color: 'cornflowerblue' } }
        }),
    ];
}