export default function getInvoked(columnsOrRows, data) {
    return typeof columnsOrRows === 'function'
        ? columnsOrRows(data)
        : columnsOrRows;
}
