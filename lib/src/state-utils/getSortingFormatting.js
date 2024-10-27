import getReducedFormatting from "./getReducedFormatting.js";

/**
 * @param {Rule[]} formatting
 * @returns {Rule[]}
 */
export default function getSortingFormatting(formatting) {
    return getReducedFormatting(formatting, ['value', 'text']);
}