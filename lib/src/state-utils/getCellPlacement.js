import stringifyId from "../core-utils/stringifyId.js";
import getCellSection from "./getCellSection.js";

/**
 * @param {CellId} cell
 * @param {ColumnLookup} columnLookup
 * @param {RowLookup} rowLookup
 * @param {Sections} sections
 * @returns {ElementPlacement}
 */
export default function getCellPlacement(cell, columnLookup, rowLookup, sections) {
    if (!cell)
        return null;

    const columnKey = stringifyId(cell.columnId);
    const rowKey = stringifyId(cell.rowId);

    if (!columnLookup.has(columnKey))
        return null;
    if (!rowLookup.has(rowKey))
        return null;

    const column = columnLookup.get(columnKey);
    const row = rowLookup.get(rowKey);

    /** @type {ElementPlacement} */
    const position = {
        width: column.width,
        height: row.height,
        section: getCellSection(column, row)
    };

    switch (row.pinned) {
        case "BEGIN":
            position.top = row.top;
            break;
        case "END":
            position.bottom = sections.top.height + sections.middle.height + sections.bottom.height - row.top - row.height;
            break;
        default:
            position.marginTop = row.top - sections.top.height;
    }

    switch (column.pinned) {
        case "BEGIN":
            position.left = column.left;
            break;
        case "END":
            position.right = sections.left.width + sections.center.width + sections.right.width - column.left - column.width;
            break;
        default:
            position.marginLeft = column.left - sections.left.width;
    }

    return position;
}
