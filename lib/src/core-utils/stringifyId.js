function stringifyObject(object) {
    const keys = Object.keys(object).sort();
    const stringified = keys.map(key => {
        return `${key}:${stringifyId(object[key])}`
    });

    return `{${stringified.join(',')}}`;
}

function stringifyArray(array) {
    const stringified = array.map(stringifyId);

    return `[${stringified.join(',')}]`;
}

export default function stringifyId(key) {
    if (key === null)
        return 'null'

    if (Array.isArray(key))
        return stringifyArray(key)

    if (typeof key === 'object')
        return stringifyObject(key)

    return JSON.stringify(key)
}