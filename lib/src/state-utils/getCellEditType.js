export default function getCellEditType(column, row) {
    if (column.type === 'FILTER' ^ row.type === 'FILTER')
        return 'FILTER';
    return 'DATA';
}