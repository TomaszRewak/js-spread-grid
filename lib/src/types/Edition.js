import stringifyId from "../core-utils/stringifyId";

// TODO: write unit tests
export default class Edition {
    constructor(editedCells) {
        this.lookup = new Map();

        editedCells.forEach(cell => {
            const rowKey = stringifyId(cell.rowId);
            const columnKey = stringifyId(cell.columnId);

            if (!this.lookup.has(rowKey))
                this.lookup.set(rowKey, new Map());

            this.lookup.get(rowKey).set(columnKey, cell.value);
        });
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
}