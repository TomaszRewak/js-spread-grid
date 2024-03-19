import FormatResolver from "../types/FormatResolver.js";

export default function getFormatResolver(formattingRules, data, rows, columns, edition) {
    return new FormatResolver(formattingRules, data, rows, columns, edition);
}
