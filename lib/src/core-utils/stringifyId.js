/**
 * @param {Object} object
 * @returns {string}
 */
function stringifyObject(object) {
    const keys = Object.keys(object).sort();
    const stringified = keys.map(key => {
        return `${key}:${stringifyId(/** @type {any} */(object)[key])}`
    });

    return `{${stringified.join(',')}}`;
}

/**
 * @template T
 * @param {Array<T>} array
 * @returns {string}
 */
function stringifyArray(array) {
    const stringified = array.map(stringifyId);

    return `[${stringified.join(',')}]`;
}

/**
 * @param {Id} id
 * @returns {Key}
 */
export default function stringifyId(id) {
    if (id === null)
        return 'null'

    if (Array.isArray(id))
        return stringifyArray(id)

    if (typeof id === 'object')
        return stringifyObject(id)

    return JSON.stringify(id)
}