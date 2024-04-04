import stringifyId from '../core-utils/stringifyId.js';

export default function getNewSortBy(sortBy, column, row, ctrlKey) {
    // TODO: better support for multi-row sorting

    function isCurrentRule(rule) {
        return column.key === stringifyId(rule.columnId || 'HEADER') && row.key === stringifyId(rule.rowId || 'HEADER');
    }

    const directionLoop = ['ASC', 'DESC', undefined];
    const currentRule = sortBy.find(isCurrentRule);
    const directionIndex = directionLoop.indexOf(currentRule?.direction);
    const newDirection = directionLoop[(directionIndex + 1) % directionLoop.length];
    const isLastRule = sortBy.indexOf(currentRule) === sortBy.length - 1;
    const shouldKeepOld = ctrlKey && (isLastRule || !currentRule);
    const rulesToKeep = shouldKeepOld ? sortBy.filter(rule => !isCurrentRule(rule)) : [];
    const newRules = newDirection ? [{ columnId: column.id, rowId: row.id, direction: newDirection }] : [];

    return [...rulesToKeep, ...newRules];
}