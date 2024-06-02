export default function getTotalSize(columns, rows) {
    return {
        width: columns.length ? columns.at(-1).rightWithBorder : 0,
        height: rows.length ? rows.at(-1).bottomWithBorder : 0
    };
}
