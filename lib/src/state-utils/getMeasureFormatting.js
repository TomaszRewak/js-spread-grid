import getReducedFormatting from "./getReducedFormatting.js";

/**
 * @param {Rule[]} formatting
 * @returns {Rule[]}
 */
export default function getMeasureFormatting(formatting) {
    return getReducedFormatting(formatting, ['value', 'text', 'font', 'padding']);
}