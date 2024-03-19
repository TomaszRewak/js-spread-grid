import VisibilityResolver from "../types/VisibilityResolver.js";

export default function getVisibilityResolver(formattingRules, data, rows, columns, filters) {
    return new VisibilityResolver(formattingRules, data, rows, columns, filters);
}
