import stringifyId from "../core-utils/stringifyId.js";
import getPinned from "./getPinned.js";

// TODO: Move
export default function getResolvedColumnsOrRows(elements, pinnedBegin, pinnedEnd) {
    return elements.map((element, index) => {
        return {
            ...element,
            type: element.type || "DATA",
            index: index,
            key: stringifyId(element.id),
            pinned: getPinned(index, elements.length, pinnedBegin, pinnedEnd)
        };
    });
}
