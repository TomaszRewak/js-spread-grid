function getVerticalSection(row) {
    if (row.pinned === "BEGIN")
        return "top";
    if (row.pinned === "END")
        return "bottom";
    return "middle";
}

function getHorizontalSection(column) {
    if (column.pinned === "BEGIN")
        return "left";
    if (column.pinned === "END")
        return "right";
    return "center";
}

export default function getCellSection(column, row) {
    const verticalSection = getVerticalSection(row);
    const horizontalSection = getHorizontalSection(column);

    return `${verticalSection}-${horizontalSection}`;
}