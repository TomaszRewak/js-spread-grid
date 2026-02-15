/** @import * as Types from "../typings.js"; */

import getReducedFormatting from "./getReducedFormatting.js";

/**
 * @param {Types.Rule[]} formatting
 * @returns {Types.Rule[]}
 */
export default function getSortOrderFormatting(formatting) {
    return getReducedFormatting(formatting, ['value', 'sortOrder']);
}
