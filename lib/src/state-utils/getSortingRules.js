import SortingRules from "../types/SortingRules.js";

export default function getSortingRules(sorting) {
    if (sorting === 'manual')
        return null;

    return new SortingRules(sorting);
}