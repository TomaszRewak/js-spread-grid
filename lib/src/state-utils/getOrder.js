/** @import * as Types from "../typings.js"; */

import stringifyId from "../core-utils/stringifyId.js";

/**
 * @param {Types.Id[]} order
 * @returns {Types.Key[]}
 */
export default function getOrder(order) {
    return order.map(id => stringifyId(id));
}