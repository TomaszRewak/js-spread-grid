export function getWithAssumedId(cells, defaultId) {
    return cells.map(cell => ({
        ...cell,
        columnId: 'id' in cell ? cell.id : defaultId,
        rowId: 'id' in cell ? cell.id : defaultId
    }));
}