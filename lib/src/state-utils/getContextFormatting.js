import getReducedFormatting from "./getReducedFormatting.js";

/**
 * @param {Rule[]} formatting
 * @returns {Rule[]}
 */
export default function getContextFormatting(formatting) {
    return getReducedFormatting(formatting, ['value', 'text', 'tooltip']);
}