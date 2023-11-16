function stringifyObject(object) {
    const keys = Object.keys(object).sort();
    const stringified = keys.map(key => {
        return `${key}:${stringifyKey(object[key])}`
    });

    return `{${stringified.join(',')}}`;
}

function stringifyArray(array) {
    const stringified = array.map(stringifyKey);

    return `[${stringified.join(',')}]`;
}

export default function stringifyKey(key) {
    if (Array.isArray(key))
        return stringifyArray(key)

    if (typeof key === 'object')
        return stringifyObject(key)

    return JSON.stringify(key)
}