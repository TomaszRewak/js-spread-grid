import getReducedFormatting from "./getReducedFormatting.js";

export default function getSortingFormatting(formatting) {
    return getReducedFormatting(formatting, ['value', 'text']);
}