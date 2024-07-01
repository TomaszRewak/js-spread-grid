function getActive(entries) {
    const ids = entries
        .filter(entry => entry.type === 'DATA')
        .map(entry => entry.id);

    return ids;
}

export function getActiveColumns(columns) {
    return getActive(columns);
}

export function getActiveRows(rows) {
    return getActive(rows);
}