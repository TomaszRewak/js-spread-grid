import getCellPlacement from "./getCellPlacement.js";

export default function getInputPlacement(editableCells, focusedCell, columnLookup, rowLookup, sections) {
    if (editableCells.length === 0)
        return null;

    return getCellPlacement(focusedCell, columnLookup, rowLookup, sections);
}
