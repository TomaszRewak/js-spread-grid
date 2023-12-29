import stringifyId from "./stringifyId";

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

    hasKeyValue(rowKey, columnKey) {
        return this.lookup.has(rowKey) && this.lookup.get(rowKey).has(columnKey);
    }

    getKeyValue(rowKey, columnKey) {
        if (!this.hasKeyValue(rowKey, columnKey))
            return undefined;

        return this.lookup.get(rowKey).get(columnKey);
    }

    hasIdValue(rowId, columnId) {
        return this.hasKeyValue(stringifyId(rowId), stringifyId(columnId));
    }

    getIdValue(rowId, columnId) {
        return this.getKeyValue(stringifyId(rowId), stringifyId(columnId));
    }
}