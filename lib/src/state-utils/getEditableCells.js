import stringifyId from "../core-utils/stringifyId.js";
import getCellType from "./getCellType.js";

export default function getEditableCells(selectedCells, formatResolver, columnLookup, rowLookup) {
    return selectedCells.map(cell => {
        const columnKey = stringifyId(cell.columnId);
        const rowKey = stringifyId(cell.rowId);

        if (!columnLookup.has(columnKey))
            return null;
        if (!rowLookup.has(rowKey))
            return null;

        const column = columnLookup.get(columnKey);
        const row = rowLookup.get(rowKey);

        return {
            edit: formatResolver.resolve(row, column).edit,
            cell: cell,
            type: getCellType(column, row)
        }
    }).filter(cell => cell?.edit);
}