import Edition from "./Edition.js";
import FormattingRules from "./FormattingRules.js";

export default class FormatResolver {
    /**
     * @param {FormattingRules} formattingRules 
     * @param {Data} data 
     * @param {ResolvedRow[]} rows 
     * @param {ResolvedColumn[]} columns 
     * @param {Edition} edition 
     */
    constructor(formattingRules, data, rows, columns, edition) {
        this.formattingRules = formattingRules;
        this.data = data;
        this.rows = rows;
        this.columns = columns;
        this.edition = edition;
    }

    // TODO: specify concrete types
    /**
     * @param {ResolvedRow} row 
     * @param {ResolvedColumn} column 
     * @returns {Cell}
     */
    resolve(row, column) {
        return this.formattingRules.resolve(
            this.data,
            this.rows,
            this.columns,
            row,
            column,
            this.edition);
    }
}