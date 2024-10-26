import stringifyId from "../core-utils/stringifyId.js";

export default class Selection {
    /**
     * @param {CellId[]} selectedCells
     */
    constructor(selectedCells) {
        /** @type {Map<Key, Set<Key>>} */
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
     * @param {Key} rowKey
     * @param {Key} columnKey
     * @returns {boolean}
     */
    isKeySelected(rowKey, columnKey) {
        return this.lookup.has(rowKey) && this.lookup.get(rowKey).has(columnKey);
    }

    /**
     * @param {Id} rowId
     * @param {Id} columnId
     * @returns {boolean}
     */
    isIdSelected(rowId, columnId) {
        return this.isKeySelected(stringifyId(rowId), stringifyId(columnId));
    }
}