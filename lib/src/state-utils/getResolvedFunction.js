/**
 * @template T, U
 * @param {T | ((_: U) => T)} value
 * @returns {(_: U) => T}
 */
export default function getResolvedFunction(value) {
    if (typeof value === 'function')
        // @ts-ignore
        return value;
    return () => value;
}