import stringifyId from "../core-utils/stringifyId.js";

// TODO: Extract the Edition class to a common base class
export default class Filtering {
    constructor(filters) {
        this.lookup = new Map();
        this.filteredColumns = new Set();
        this.filteredRows = new Set();

        filters.forEach(cell => {
            const rowKey = stringifyId(cell.rowId);
            const columnKey = stringifyId(cell.columnId);

            if (!this.lookup.has(rowKey))
                this.lookup.set(rowKey, new Map());

            this.lookup.get(rowKey).set(columnKey, cell.expression);
            this.filteredColumns.add(columnKey);
            this.filteredRows.add(rowKey);
        });
    }

    hasRowFilters() {
        return this.filteredRows.size > 0;
    }

    hasColumnFilters() {
        return this.filteredColumns.size > 0;
    }

    hasRowFiltersByKey(rowKey) {
        return this.filteredRows.has(rowKey);
    }

    hasColumnFiltersByKey(columnKey) {
        return this.filteredColumns.has(columnKey);
    }

    hasValueByKey(rowKey, columnKey) {
        return this.lookup.has(rowKey) && this.lookup.get(rowKey).has(columnKey);
    }

    getValueByKey(rowKey, columnKey) {
        if (!this.hasValueByKey(rowKey, columnKey))
            return undefined;

        return this.lookup.get(rowKey).get(columnKey);
    }

    hasValueById(rowId, columnId) {
        return this.hasValueByKey(stringifyId(rowId), stringifyId(columnId));
    }

    getValueById(rowId, columnId) {
        return this.getValueByKey(stringifyId(rowId), stringifyId(columnId));
    }

    hasValueByKeyAndSelector(rowKey, columnKey, selector) {
        if (this.hasValueByKey(selector, columnKey))
            return true;
        if (this.hasValueByKey(rowKey, selector.key))
            return true;
        return false;
    }

    getValueByKeyAndSelector(rowKey, columnKey, selector) {
        if (this.hasValueByKey(selector, columnKey))
            return this.getValueByKey(selector, columnKey);
        if (this.hasValueByKey(rowKey, selector.key))
            return this.getValueByKey(rowKey, selector);
        return undefined;
    }
};