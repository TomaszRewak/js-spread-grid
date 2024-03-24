import stringifyId from "../core-utils/stringifyId.js";
import getPinned from "./getPinned.js";

function getResolved(elements, pinnedBegin, pinnedEnd) {
    return elements.map((element, index) => {
        const id = 'id' in element ? element.id : element.type;
        return {
            ...element,
            id: id,
            type: element.type || "DATA",
            index: index,
            key: stringifyId(id),
            pinned: getPinned(index, elements.length, pinnedBegin, pinnedEnd),
            header: element.header || id
        };
    });
}

export function getResolvedColumns(columns, pinnedBegin, pinnedEnd) {
    return getResolved(columns, pinnedBegin, pinnedEnd);
}

export function getResolvedRows(rows, pinnedBegin, pinnedEnd) {
    return getResolved(rows, pinnedBegin, pinnedEnd);
}
