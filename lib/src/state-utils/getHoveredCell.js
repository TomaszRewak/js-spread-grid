import getColumnIndex from "./getColumnIndex.js";
import getInternalPosition from "./getInternalPosition.js";
import getRowIndex from "./getRowIndex.js";

export default function getHoveredCell(element, mousePosition, rows, columns, fixedSize, totalSize) {
    if (!mousePosition)
        return null;
    if (mousePosition.x < 0 || mousePosition.y < 0 || mousePosition.x > totalSize.width || mousePosition.y > totalSize.height)
        return null;

    const internalPosition = getInternalPosition(element, mousePosition, fixedSize, totalSize);
    const hoverRowIndex = getRowIndex(rows, internalPosition.y);
    const hoverColumnIndex = getColumnIndex(columns, internalPosition.x);

    if (hoverRowIndex === -1 || hoverColumnIndex === -1)
        return null;

    return {
        rowId: rows[hoverRowIndex].id,
        columnId: columns[hoverColumnIndex].id
    };
}
