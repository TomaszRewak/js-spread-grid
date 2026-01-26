import stringifyId from "../core-utils/stringifyId.js";
import Selection from "../types/Selection.js";

/**
 * @param {CellId[]} selectedCells
 * @param {PlacedColumn[]} columns
 * @param {PlacedRow[]} rows
 * @param {FormatResolver} formatResolver
 * @returns {string}
 */
export default function getClipboardData(selectedCells, columns, rows, formatResolver) {
    const columnLookup = new Map(columns.map(column => [column.key, column]));
    const rowLookup = new Map(rows.map(row => [row.key, row]));
    const selectedCellKeys = selectedCells.map(cell => ({
        columnKey: stringifyId(cell.columnId),
        rowKey: stringifyId(cell.rowId)
    })).filter(cell => columnLookup.has(cell.columnKey) && rowLookup.has(cell.rowKey));
    const selectedColumns = new Set(selectedCellKeys.map(cell => cell.columnKey));
    const selectedRows = new Set(selectedCellKeys.map(cell => cell.rowKey));

    if (selectedCellKeys.length === 0)
        return '';

    const selection = new Selection(selectedCells);
    const minColumnIndex = Math.min(...selectedCellKeys.map(cell => columnLookup.get(cell.columnKey).index));
    const maxColumnIndex = Math.max(...selectedCellKeys.map(cell => columnLookup.get(cell.columnKey).index));
    const minRowIndex = Math.min(...selectedCellKeys.map(cell => rowLookup.get(cell.rowKey).index));
    const maxRowIndex = Math.max(...selectedCellKeys.map(cell => rowLookup.get(cell.rowKey).index));

    const stringBuilder = [];

    for (let rowIndex = minRowIndex; rowIndex <= maxRowIndex; rowIndex++) {
        const row = rows[rowIndex];
        const rowKey = row.key;

        if (!selectedRows.has(rowKey))
            continue;

        for (let columnIndex = minColumnIndex; columnIndex <= maxColumnIndex; columnIndex++) {
            const column = columns[columnIndex];
            const columnKey = column.key;

            if (!selectedColumns.has(columnKey))
                continue;

            if (selection.isKeySelected(rowKey, columnKey)) {
                const cellData = formatResolver.resolve(row, column).text;
                stringBuilder.push(cellData);
            }

            if (columnIndex < maxColumnIndex)
                stringBuilder.push('\t');
        }

        if (rowIndex < maxRowIndex)
            stringBuilder.push('\n');
    }

    return stringBuilder.join('');
}