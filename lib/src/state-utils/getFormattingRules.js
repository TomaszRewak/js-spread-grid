/** @import * as Types from "../typings.js"; */

import FormattingRules from "../types/FormattingRules.js";

/**
 * @param {Types.Rule[]} formatting
 * @returns {FormattingRules}
 */
export default function getFormattingRules(formatting) {
    return new FormattingRules(formatting);
}
