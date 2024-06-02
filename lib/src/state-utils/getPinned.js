// TODO: Move
export default function getPinned(index, length, pinnedBegin, pinnedEnd) {
    if (index < pinnedBegin)
        return "BEGIN";
    if (index >= length - pinnedEnd)
        return "END";
    return undefined;
}
