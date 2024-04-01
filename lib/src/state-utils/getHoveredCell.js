import getColumnIndex from "./getColumnIndex.js";
import getRowIndex from "./getRowIndex.js";

export default function getHoveredCell(element, mousePosition, rows, columns, fixedSize, totalSize) {
    // TODO: sometimes mousePosition is outside of bounds and it crashes the click events

    if (!mousePosition)
        return null;
    if (mousePosition.x < 0 || mousePosition.y < 0 || mousePosition.x > totalSize.width || mousePosition.y > totalSize.height)
        return null;

    const scrollOffset = {
        left: element.scrollLeft,
        top: element.scrollTop
    };

    const clientSize = {
        width: element.clientWidth,
        height: element.clientHeight
    };

    const x = mousePosition.x <= fixedSize.left
        ? mousePosition.x
        : mousePosition.x >= clientSize.width - fixedSize.right
            ? totalSize.width - clientSize.width + mousePosition.x
            : mousePosition.x + scrollOffset.left;
    const y = mousePosition.y <= fixedSize.top
        ? mousePosition.y
        : mousePosition.y >= clientSize.height - fixedSize.bottom
            ? totalSize.height - clientSize.height + mousePosition.y
            : mousePosition.y + scrollOffset.top;

    const hoverRowIndex = getRowIndex(rows, y);
    const hoverColumnIndex = getColumnIndex(columns, x);

    if (hoverRowIndex === -1 || hoverColumnIndex === -1)
        return null;

    return {
        rowId: rows[hoverRowIndex].id,
        columnId: columns[hoverColumnIndex].id
    };
}
