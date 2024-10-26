import FormatResolver from "../types/FormatResolver.js";

/**
 * @param {FormattingRules} formattingRules
 * @param {object} data
 * @param {ResolvedRow[]} rows
 * @param {ResolvedColumn[]} columns
 * @param {Edition} edition
 * @returns {FormatResolver}
 */
export default function getFormatResolver(formattingRules, data, rows, columns, edition) {
    return new FormatResolver(formattingRules, data, rows, columns, edition);
}
