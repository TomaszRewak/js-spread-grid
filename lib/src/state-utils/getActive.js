function getActive(entries, callback) {
    const ids = entries
        .filter(entry => entry.type === 'DATA')
        .map(entry => entry.id);

    callback(ids);

    return ids;
}

export function getActiveColumns(columns, callback) {
    return getActive(columns, callback);
}

export function getActiveRows(rows, callback) {
    return getActive(rows, callback);
}