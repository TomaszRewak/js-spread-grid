/** @import * as Types from "../typings.js"; */

import getReducedFormatting from "./getReducedFormatting.js";

/**
 * @param {Types.Rule[]} formatting
 * @returns {Types.Rule[]}
 */
export default function getContextFormatting(formatting) {
    return getReducedFormatting(formatting, ['value', 'text', 'tooltip']);
}