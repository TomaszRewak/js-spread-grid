import stringifyId from "../core-utils/stringifyId.js";

/**
 * @param {Id[]} order
 * @returns {Key[]}
 */
export default function getOrder(order) {
    return order.map(id => stringifyId(id));
}