export default function getKeys(entries) {
    return new Set(entries.map(entry => entry.key));
}
