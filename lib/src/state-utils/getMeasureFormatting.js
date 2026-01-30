/** @import * as Types from "../typings.js"; */

import getReducedFormatting from "./getReducedFormatting.js";

/**
 * @param {Types.Rule[]} formatting
 * @returns {Types.Rule[]}
 */
export default function getMeasureFormatting(formatting) {
    return getReducedFormatting(formatting, ['value', 'text', 'font', 'padding']);
}