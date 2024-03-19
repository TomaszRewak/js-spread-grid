import Filtering from "./Filtering.js";

export default class FormatResolver {
    constructor(formattingRules, data, rows, columns, edition) {
        this.formattingRules = formattingRules;
        this.data = data;
        this.rows = rows;
        this.columns = columns;
        this.edition = edition;
        this.filtering = new Filtering([]);
    }

    resolve(row, column) {
        return this.formattingRules.resolve(
            this.data,
            this.rows,
            this.columns,
            row,
            column,
            this.edition,
            this.filtering);
    }
}