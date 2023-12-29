export default class FormatResolver {
    constructor(formatResolver, data, rows, columns, edition) {
        this.formatResolver = formatResolver;
        this.data = data;
        this.rows = rows;
        this.columns = columns;
        this.edition = edition;
    }

    resolve(row, column) {
        return this.formatResolver.resolve(this.data, this.rows, this.columns, row, column, this.edition);
    }
}