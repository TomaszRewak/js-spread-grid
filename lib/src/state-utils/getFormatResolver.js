/** @import * as Types from "../typings.js"; */

import FormatResolver from "../types/FormatResolver.js";

/**
 * @param {Types.FormattingRules} formattingRules
 * @param {object} data
 * @param {Types.ResolvedRow[]} rows
 * @param {Types.ResolvedColumn[]} columns
 * @param {Types.Edition} edition
 * @returns {FormatResolver}
 */
export default function getFormatResolver(formattingRules, data, rows, columns, edition) {
    return new FormatResolver(formattingRules, data, rows, columns, edition);
}
