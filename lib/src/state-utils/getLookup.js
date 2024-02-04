export default function getLookup(elements) {
    return elements.reduce((lookup, element) => lookup.set(element.key, element), new Map());
}
