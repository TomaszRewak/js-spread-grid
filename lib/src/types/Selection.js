/** @import * as Types from "../typings.js"; */

import stringifyId from "../core-utils/stringifyId.js";

export default class Selection {
    /**
     * @param {Types.CellId[]} selectedCells
     */
    constructor(selectedCells) {
        /** @type {Map<Types.Key, Set<Types.Key>>} */
        this.lookup = new Map();

        selectedCells.forEach(cell => {
            const rowKey = stringifyId(cell.rowId);
            const columnKey = stringifyId(cell.columnId);

            if (!this.lookup.has(rowKey))
                this.lookup.set(rowKey, new Set());

            this.lookup.get(rowKey).add(columnKey);
        });
    }

    /**
     * @param {Types.Key} rowKey
     * @param {Types.Key} columnKey
     * @returns {boolean}
     */
    isKeySelected(rowKey, columnKey) {
        return this.lookup.has(rowKey) && this.lookup.get(rowKey).has(columnKey);
    }

    /**
     * @param {Types.Id} rowId
     * @param {Types.Id} columnId
     * @returns {boolean}
     */
    isIdSelected(rowId, columnId) {
        return this.isKeySelected(stringifyId(rowId), stringifyId(columnId));
    }
}