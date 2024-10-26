/**
 * @param {Cell} cell
 * @param {ResolvedColumn} column
 * @param {ResolvedRow} row
 * @param {Edition} edition
 */
export default function getToggledValue(cell, column, row, edition) {
    const value = edition.hasValueByKey(row.key, column.key)
        ? edition.getValueByKey(row.key, column.key)
        : cell.value;
    const toggle = cell.edit.toggle;

    if (typeof toggle === 'function')
        return toggle({ value }); // TODO: expand by context

    return toggle[(toggle.indexOf(value) + 1) % toggle.length];
}