export default class VisibilityResolver {
    constructor(formattingRules, data, rows, columns, edition, filtering) {
        this.formattingRules = formattingRules;
        this.data = data;
        this.rows = rows;
        this.columns = columns;
        this.edition = edition;
        this.filtering = filtering;
    }

    isColumnVisible(column) {
        const filteredColumns = // Get keys of columns for which there is at least one filter set

        let visible = true;
        
    }
}