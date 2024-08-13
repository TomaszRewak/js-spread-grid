export function getWithAssumedId(cells, defaultId) {
    return cells.map(cell => ({
        ...cell,
        columnId: 'columnId' in cell ? cell.columnId : defaultId,
        rowId: 'rowId' in cell ? cell.rowId : defaultId
    }));
}