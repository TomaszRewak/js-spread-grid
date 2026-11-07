/** @import * as Types from "../typings.js"; */

import stringifyId from "../core-utils/stringifyId.js";

/**
 * @template {Types.ResolvedDimension} T
 * @param {T[]} dimensions
 * @param {Types.Id[]} hidden
 * @returns {T[]}
 */
export default function getVisible(dimensions, hidden) {
    if (!hidden.length)
        return dimensions;

    const keys = new Set(hidden.map(stringifyId));
    return dimensions.filter(dimension => dimension.type === 'DYNAMIC-BLOCK' || !keys.has(dimension.key));
}