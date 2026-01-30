/** @import * as Types from "../typings.js"; */

import Edition from "./Edition.js";
import FormattingRules from "./FormattingRules.js";

export default class FormatResolver {
    /**
     * @param {FormattingRules} formattingRules 
     * @param {Types.Data} data 
     * @param {Types.ResolvedRow[]} rows 
     * @param {Types.ResolvedColumn[]} columns 
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
     * @param {Types.ResolvedStaticRow} row 
     * @param {Types.ResolvedStaticColumn} column 
     * @returns {Types.Cell}
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