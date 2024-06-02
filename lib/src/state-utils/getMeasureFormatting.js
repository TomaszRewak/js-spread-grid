import getReducedFormatting from "./getReducedFormatting.js";

export default function getMeasureFormatting(formatting) {
    return getReducedFormatting(formatting, ['value', 'text', 'font', 'padding']);
}