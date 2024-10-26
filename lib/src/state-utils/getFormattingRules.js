import FormattingRules from "../types/FormattingRules.js";

/**
 * @param {Rule[]} formatting
 * @returns {FormattingRules}
 */
export default function getFormattingRules(formatting) {
    return new FormattingRules(formatting);
}
