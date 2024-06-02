export default function getOrdered(entries, order) {
    if (!order) {
        return entries;
    }

    const map = new Map();

    for (const entry of entries) {
        map.set(entry.key, entry);
    }

    const mixedResult = [];

    for (const key of order) {
        if (map.has(key)) {
            mixedResult.push(map.get(key));
            map.delete(key);
        }
    }

    for (const entry of entries) {
        if (map.has(entry.key)) {
            mixedResult.push(map.get(entry.key));
        }
    }

    return [
        ...mixedResult.filter(entry => entry.pinned === "BEGIN"),
        ...mixedResult.filter(entry => !entry.pinned),
        ...mixedResult.filter(entry => entry.pinned === "END")
    ]
}