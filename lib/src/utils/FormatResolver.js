export default class FormatResolver {
    constructor(formatResolver, data, rows, columns) {
        this.formatResolver = formatResolver;
        this.data = data;
        this.rows = rows;
        this.columns = columns;
    }

    resolve(row, column) {
        return this.formatResolver.resolve(this.data, this.rows, this.columns, row, column);
    }
}