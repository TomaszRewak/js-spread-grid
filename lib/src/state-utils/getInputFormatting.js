import getReducedFormatting from "./getReducedFormatting.js";

export default function getInputFormatting(formatting) {
    return getReducedFormatting(formatting, ['value', 'text', 'edit']);
}