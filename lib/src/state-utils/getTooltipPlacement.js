import getCellPlacement from "./getCellPlacement.js";

/**
 * @param {string} tooltip
 * @param {CellId} focusedCell
 * @param {ColumnLookup} columnLookup
 * @param {RowLookup} rowLookup
 * @param {Sections} sections
 * @returns {TooltipPlacement | null}
 */
export default function getTooltipPlacement(tooltip, focusedCell, columnLookup, rowLookup, sections) {
    if (!tooltip)
        return null;

    const cellPlacement = getCellPlacement(focusedCell, columnLookup, rowLookup, sections);

    if (!cellPlacement)
        return null;

    return {
        top: cellPlacement.top,
        left: cellPlacement.left
    };
}