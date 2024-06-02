import stringifyId from '../core-utils/stringifyId.js';

export default function getNewSortBy(sortBy, column, row, ctrlKey) {
    // TODO: better support for multi-row sorting

    function isCurrentRule(rule) {
        const columnId = 'columnId' in rule ? rule.columnId : 'HEADER';
        const rowId = 'rowId' in rule ? rule.rowId : 'HEADER';

        return column.key === stringifyId(columnId) && row.key === stringifyId(rowId);
    }

    function isConflictingWithCurrentRule(rule) {
        const columnId = 'columnId' in rule ? rule.columnId : 'HEADER';
        const rowId = 'rowId' in rule ? rule.rowId : 'HEADER';

        return column.type === 'HEADER' && column.key === stringifyId(columnId)
            || row.type === 'HEADER' && row.key === stringifyId(rowId);
    }

    const directionLoop = ['ASC', 'DESC', undefined];
    const currentRule = sortBy.find(isCurrentRule);
    const directionIndex = directionLoop.indexOf(currentRule?.direction);
    const newDirection = directionLoop[(directionIndex + 1) % directionLoop.length];
    const isLastRule = sortBy.indexOf(currentRule) === sortBy.length - 1;
    const shouldKeepOld = ctrlKey && (isLastRule || !currentRule);
    const rulesToKeep = shouldKeepOld
        ? sortBy.filter(rule => !isCurrentRule(rule))
        : sortBy.filter(rule => !isConflictingWithCurrentRule(rule));
    const newRules = newDirection ? [{ columnId: column.id, rowId: row.id, direction: newDirection }] : [];

    return [...rulesToKeep, ...newRules];
}