export default function getColumnsOrRows(columnsOrRows, data) {
    return typeof columnsOrRows === 'function'
        ? columnsOrRows(data)
        : columnsOrRows;
}
