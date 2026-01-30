/** @import * as Types from "../typings.js"; */

import SortingRules from "../types/SortingRules.js";

/**
 * @param {Types.SortingRule[] | 'manual'} sorting
 * @returns {SortingRules}
 */
export default function getSortingRules(sorting) {
    if (sorting === 'manual')
        return null;

    return new SortingRules(sorting);
}