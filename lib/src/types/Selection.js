import stringifyId from "../core-utils/stringifyId";

export default class Selection {
    constructor(selectedCells) {
        this.lookup = new Map();

        selectedCells.forEach(cell => {
            const rowKey = stringifyId(cell.rowId);
            const columnKey = stringifyId(cell.columnId);

            if (!this.lookup.has(rowKey))
                this.lookup.set(rowKey, new Set());

            this.lookup.get(rowKey).add(columnKey);
        });
    }

    isKeySelected(rowKey, columnKey) {
        return this.lookup.has(rowKey) && this.lookup.get(rowKey).has(columnKey);
    }

    isIdSelected(rowId, columnId) {
        return this.isKeySelected(stringifyId(rowId), stringifyId(columnId));
    }
}