import FormatResolver from "../types/FormatResolver";

export default function getFormatResolver(formattingRules, data, rows, columns, edition) {
    return new FormatResolver(formattingRules, data, rows, columns, edition);
}
