/** @import * as Types from "../typings.js"; */

import FilteringRules from "../types/FilteringRules.js";

/**
 * @param {Types.FilteringRule[]} filtering
 * @returns {FilteringRules}
 */
export default function getFilteringRules(filtering) {
    return new FilteringRules(filtering);
}