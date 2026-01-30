/** @import * as Types from "../typings.js"; */

import stringifyId from "../core-utils/stringifyId.js";

// TODO: write unit tests
export default class Edition {
    /**
     * @param {Types.EditedCell[]} editedCells
     */
    constructor(editedCells) {
        /** @type {Map<Types.Key, Map<Types.Key, Types.Value>>} */
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
     * @param {Types.Key} rowKey
     * @param {Types.Key} columnKey
     * @returns {boolean}
     */
    hasValueByKey(rowKey, columnKey) {
        return this.lookup.has(rowKey) && this.lookup.get(rowKey).has(columnKey);
    }

    /**
     * @param {Types.Key} rowKey
     * @param {Types.Key} columnKey
     * @returns {Types.Value}
     */
    getValueByKey(rowKey, columnKey) {
        if (!this.hasValueByKey(rowKey, columnKey))
            return undefined;

        return this.lookup.get(rowKey).get(columnKey);
    }

    /**
     * 
     * @param {Types.Id} rowId 
     * @param {Types.Id} columnId 
     * @returns {boolean}
     */
    hasValueById(rowId, columnId) {
        return this.hasValueByKey(stringifyId(rowId), stringifyId(columnId));
    }

    /**
     * 
     * @param {Types.Id} rowId 
     * @param {Types.Id} columnId 
     * @returns {Types.Value}
     */
    getValueById(rowId, columnId) {
        return this.getValueByKey(stringifyId(rowId), stringifyId(columnId));
    }
}