import getReducedFormatting from "./getReducedFormatting.js";

export default function getContextFormatting(formatting) {
    return getReducedFormatting(formatting, ['value', 'text', 'tooltip']);
}