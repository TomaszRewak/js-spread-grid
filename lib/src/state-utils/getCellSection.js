/**
 * @param {PlacedRow} row
 * @returns {VerticalSectionName}
 */
function getVerticalSection(row) {
    if (row.pinned === "BEGIN")
        return "top";
    if (row.pinned === "END")
        return "bottom";
    return "middle";
}

/**
 * @param {PlacedColumn} column
 * @returns {HorizontalSectionName}
 */
function getHorizontalSection(column) {
    if (column.pinned === "BEGIN")
        return "left";
    if (column.pinned === "END")
        return "right";
    return "center";
}

/**
 * @param {PlacedColumn} column
 * @param {PlacedRow} row
 * @returns {SectionName}
 */
export default function getCellSection(column, row) {
    const verticalSection = getVerticalSection(row);
    const horizontalSection = getHorizontalSection(column);

    return `${verticalSection}-${horizontalSection}`;
}