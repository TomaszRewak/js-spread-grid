export default function getColumnIndex(columns, x) {
    if (columns.length === 0)
        return -1;
    if (x < columns[0].leftWithBorder)
        return -1;
    if (x > columns[columns.length - 1].rightWithBorder)
        return -1;

    let iterA = 0;
    let iterC = columns.length - 1;

    while (iterA <= iterC) {
        const iterB = Math.floor((iterA + iterC) / 2);

        if (x < columns[iterB].leftWithBorder)
            iterC = iterB - 1;
        else if (x > columns[iterB].rightWithBorder)
            iterA = iterB + 1;

        else
            return iterB;
    }

    return -1;
}
