import FilteringRules from "../types/FilteringRules.js";

export default function getFilteringRules(filtering) {
    return new FilteringRules(filtering);
}