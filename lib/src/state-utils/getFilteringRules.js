import FilteringRules from "../types/FilteringRules.js";

/**
 * @param {FilteringRule[]} filtering
 * @returns {FilteringRules}
 */
export default function getFilteringRules(filtering) {
    return new FilteringRules(filtering);
}