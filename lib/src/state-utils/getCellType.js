export default function getCellType(column, row) {
    if (column.type === 'FILTER' ^ row.type === 'FILTER')
        return 'FILTER';
    if (column.type === 'DATA' && row.type === 'DATA')
        return 'DATA';
    return 'OTHER';
}