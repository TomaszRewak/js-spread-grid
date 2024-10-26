import stringifyId from "../core-utils/stringifyId.js";

// TODO: write unit tests
export default class Edition {
    /**
     * @param {EditedCell[]} editedCells
     */
    constructor(editedCells) {
        /** @type {Map<Key, Map<Key, Value>>} */
        this.lookup = new Map();

        editedCells.forEach(cell => {
            const rowKey = stringifyId(cell.rowId);
            const columnKey = stringifyId(cell.columnId);

            if (!this.lookup.has(rowKey))
                this.lookup.set(rowKey, new Map());

            this.lookup.get(rowKey).set(columnKey, cell.value);
        });
    }

    /**
     * @param {Key} rowKey
     * @param {Key} columnKey
     * @returns {boolean}
     */
    hasValueByKey(rowKey, columnKey) {
        return this.lookup.has(rowKey) && this.lookup.get(rowKey).has(columnKey);
    }

    /**
     * @param {Key} rowKey
     * @param {Key} columnKey
     * @returns {Value}
     */
    getValueByKey(rowKey, columnKey) {
        if (!this.hasValueByKey(rowKey, columnKey))
            return undefined;

        return this.lookup.get(rowKey).get(columnKey);
    }

    /**
     * 
     * @param {Id} rowId 
     * @param {Id} columnId 
     * @returns {boolean}
     */
    hasValueById(rowId, columnId) {
        return this.hasValueByKey(stringifyId(rowId), stringifyId(columnId));
    }

    /**
     * 
     * @param {Id} rowId 
     * @param {Id} columnId 
     * @returns {Value}
     */
    getValueById(rowId, columnId) {
        return this.getValueByKey(stringifyId(rowId), stringifyId(columnId));
    }
}