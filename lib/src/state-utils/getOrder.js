import stringifyId from "../core-utils/stringifyId.js";

export default function getOrder(order) {
    return order.map(id => stringifyId(id));
}