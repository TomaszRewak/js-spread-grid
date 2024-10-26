import getReducedFormatting from "./getReducedFormatting.js";

/**
 * @param {Rule[]} formatting
 * @returns {Rule[]}
 */
export default function getInputFormatting(formatting) {
    return getReducedFormatting(formatting, ['value', 'text', 'edit']);
}