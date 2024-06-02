import getReducedFormatting from "./getReducedFormatting.js";

export default function getFilterFormatting(formatting) {
    return getReducedFormatting(formatting, ['value', 'text']);
}