import stringifyId from '../core-utils/stringifyId';

function getHighlightColor(baseColor, isStrong) {
    if (isStrong)
        return baseColor + '99';
    else
        return baseColor + '33';
}

export default function getRenderFormattingRules(formatting, hoveredCell, focusedCell, selection, highlight, edition) {
    const hoveredColumnKey = hoveredCell ? stringifyId(hoveredCell.columnId) : null;
    const hoveredRowKey = hoveredCell ? stringifyId(hoveredCell.rowId) : null;

    const focusedColumnKey = focusedCell ? stringifyId(focusedCell.columnId) : null;
    const focusedRowKey = focusedCell ? stringifyId(focusedCell.rowId) : null;

    const isSelected = (rows, columns, rowIndex, columnIndex) => {
        if (rowIndex < 0 || rowIndex >= rows.length)
            return false;
        if (columnIndex < 0 || columnIndex >= columns.length)
            return false;

        const rowKey = rows[rowIndex].key;
        const columnKey = columns[columnIndex].key;

        return selection.isKeySelected(rowKey, columnKey);
    };

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
        ...formatting,
        {
            column: { match: 'ANY' },
            row: { match: 'ANY' },
            condition: ({ row, column }) => hoveredColumnKey === column.key || hoveredRowKey === row.key,
            style: { highlight: '#81948133' },
        },
        {
            column: { match: 'ANY' },
            row: { match: 'ANY' },
            condition: ({ row, column }) => hoveredColumnKey === column.key && hoveredRowKey === row.key,
            style: { highlight: '#81948188' },
        },
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
        {
            column: { match: 'ANY' },
            row: { match: 'ANY' },
            condition: ({ row, column }) => focusedColumnKey === column.key && focusedRowKey === row.key,
            style: { background: 'white' },
        },
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
    ];
}