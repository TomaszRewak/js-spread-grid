import Edition from "./Edition";

export default class VisibilityResolver {
    constructor(formattingRules, data, rows, columns, filtering) {
        this.formattingRules = formattingRules;
        this.data = data;
        this.rows = rows;
        this.columns = columns;
        this.edition = new Edition([]);
        this.filtering = filtering;
    }

    findVisibleColumns() {
        if (!this.filtering.hasRowFilters())
            return this.columns;

        return this.columns.filter(column => {
            return this.rows.every(row => {
                if (!this.filtering.hasRowFiltersByKey(row.key))
                    return true;

                const cell = this.formattingRules.resolve(
                    this.data,
                    this.rows,
                    this.columns,
                    row,
                    column,
                    this.edition,
                    this.filtering);

                return cell.visible;
            });
        });
    }

    findVisibleRows() {
        // TODO: don't include search columns in that check
        if (!this.filtering.hasColumnFilters())
            return this.rows;

        return this.rows.filter(row => {
            return this.columns.every(column => {
                if (!this.filtering.hasColumnFiltersByKey(column.key))
                    return true;

                const cell = this.formattingRules.resolve(
                    this.data,
                    this.rows,
                    this.columns,
                    row,
                    column,
                    this.edition,
                    this.filtering);

                return cell.visible;
            });
        });
    }
}