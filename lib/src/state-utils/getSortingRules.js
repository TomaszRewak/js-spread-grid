import SortingRules from "../types/SortingRules.js";

/**
 * @param {SortingRule[] | 'manual'} sorting
 * @returns {SortingRules}
 */
export default function getSortingRules(sorting) {
    if (sorting === 'manual')
        return null;

    return new SortingRules(sorting);
}