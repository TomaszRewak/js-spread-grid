/**
 * @param {PlacedRow[]} rows
 * @param {number} y
 */
export default function getRowIndex(rows, y) {
    if (rows.length === 0)
        return -1;
    if (y < rows[0].topWithBorder)
        return -1;
    if (y > rows[rows.length - 1].bottomWithBorder)
        return -1;

    let iterA = 0;
    let iterC = rows.length - 1;

    while (iterA <= iterC) {
        const iterB = Math.floor((iterA + iterC) / 2);

        if (y < rows[iterB].topWithBorder)
            iterC = iterB - 1;
        else if (y > rows[iterB].bottomWithBorder)
            iterA = iterB + 1;

        else
            return iterB;
    }

    return -1;
}
