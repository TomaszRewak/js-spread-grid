import stringifyId from "./stringifyId";

export default function addRenderFormattingRules(formatting, hoveredCell, focusedCell, selection) {
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
        ...formatting,
        {
            column: { match: 'ANY' },
            row: { match: 'ANY' },
            condition: (data, rows, columns, row, column, value) => hoveredColumnKey === column.key || hoveredRowKey === row.key,
            style: { highlight: "#81948133" },
        },
        {
            column: { match: 'ANY' },
            row: { match: 'ANY' },
            condition: (data, rows, columns, row, column, value) => hoveredColumnKey === column.key && hoveredRowKey === row.key,
            style: { highlight: "#81948188" },
        },
        {
            column: { match: 'ANY' },
            row: { match: 'ANY' },
            condition: (data, rows, columns, row, column, value) => isSelected(rows, columns, row.index, column.index),
            style: (data, rows, columns, row, column, value) => ({
                ...(!isSelected(rows, columns, row.index - 1, column.index) ? { borderTop: { width: 5, color: '#596959', index: Number.MAX_SAFE_INTEGER } } : {}),
                ...(!isSelected(rows, columns, row.index + 1, column.index) ? { borderBottom: { width: 5, color: '#596959', index: Number.MAX_SAFE_INTEGER } } : {}),
                ...(!isSelected(rows, columns, row.index, column.index - 1) ? { borderLeft: { width: 5, color: '#596959', index: Number.MAX_SAFE_INTEGER } } : {}),
                ...(!isSelected(rows, columns, row.index, column.index + 1) ? { borderRight: { width: 5, color: '#596959', index: Number.MAX_SAFE_INTEGER } } : {}),
                highlight: focusedColumnKey !== column.key || focusedRowKey !== row.key ? "#81948199" : null
            }),
        },
        {
            column: { match: 'ANY' },
            row: { match: 'ANY' },
            condition: (data, rows, columns, row, column, value) => focusedColumnKey === column.key && focusedRowKey === row.key,
            style: { background: "white" },
        }
    ];
}