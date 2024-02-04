import stringifyId from "../core-utils/stringifyId";
import getPinned from "./getPinned";

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
