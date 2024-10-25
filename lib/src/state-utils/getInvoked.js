/**
 * @template T
 * @template U
 * @param {T | ((data: U) => T)} value
 * @param {U} data
 */
export default function getInvoked(value, data) {
    return typeof value === 'function'
        ? /** @type {(data: U) => T} */ (value)(data)
        : value;
}
