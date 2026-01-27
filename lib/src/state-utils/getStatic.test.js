import stringifyId from '../core-utils/stringifyId.js';
import { getStaticRows } from './getStatic.js';

/**
 * @param {string} id
 * @param {number} height
 * @returns {MeasuredStaticRow}
 */
function createStaticRow(id, height) {
    return {
        type: 'DATA',
        id,
        key: stringifyId(id),
        selector: id,
        index: 0,
        labels: [],
        header: '',
        height,
    };
}

/**
 * @param {number} count
 * @param {number} rowHeight
 * @param {number} borderWidth
 * @returns {MeasuredRow}
 */
function createDynamicBlock(count, rowHeight, borderWidth) {
    return {
        type: 'DYNAMIC-BLOCK',
        index: 0,
        labels: [],
        count,
        rowHeight,
        height: count * rowHeight + (count - 1) * borderWidth,
        id: ({ selector }) => `row_${selector}`,
        selector: ({ index }) => index,
        header: ({ selector }) => `Row ${selector}`,
    };
}

/**
 * @param {MeasuredStaticRow[]} rows
 * @returns {Array<{type: string, id: any, height: number}>}
 */
function simplifyRows(rows) {
    return rows.map(row => ({
        type: row.type,
        id: row.id,
        height: row.height,
    }));
}

describe('getStaticRows', () => {
    const borderWidth = 1;
    const data = {};

    describe('without dynamic blocks', () => {
        it('should return rows as-is when there are no dynamic blocks', () => {
            const rows = [
                createStaticRow('row1', 30),
                createStaticRow('row2', 30),
            ];
            const pinning = { top: 0, bottom: 0, left: 0, right: 0 };
            const scrollRect = { top: 0, left: 0, width: 500, height: 300 };
            const fixedSize = { top: 0, bottom: 0, left: 0, right: 0 };

            const result = getStaticRows(data, rows, pinning, scrollRect, fixedSize, borderWidth);

            expect(result).toBe(rows);
        });
    });

    describe('with a single dynamic block, no pinning', () => {
        it('should expand all visible rows and create separators for hidden ones', () => {
            const rows = [createDynamicBlock(100, 30, borderWidth)];
            const pinning = { top: 0, bottom: 0, left: 0, right: 0 };
            const scrollRect = { top: 0, left: 0, width: 500, height: 100 };
            const fixedSize = { top: borderWidth, bottom: 0, left: 0, right: 0 };

            const result = getStaticRows(data, rows, pinning, scrollRect, fixedSize, borderWidth);
            const simplified = simplifyRows(result);

            expect(simplified[0]).toEqual({ type: 'DATA', id: 'row_0', height: 30 });
            expect(simplified[1]).toEqual({ type: 'DATA', id: 'row_1', height: 30 });
            expect(simplified[2]).toEqual({ type: 'DATA', id: 'row_2', height: 30 });
            expect(simplified[simplified.length - 1].type).toBe('SEPARATOR');
        });

        it('should expand rows in the middle when scrolled', () => {
            const rows = [createDynamicBlock(100, 30, borderWidth)];
            const pinning = { top: 0, bottom: 0, left: 0, right: 0 };
            const rowSpan = 30 + borderWidth;
            const scrollTop = 50 * rowSpan;
            const scrollRect = { top: scrollTop, left: 0, width: 500, height: 100 };
            const fixedSize = { top: borderWidth, bottom: 0, left: 0, right: 0 };

            const result = getStaticRows(data, rows, pinning, scrollRect, fixedSize, borderWidth);
            const simplified = simplifyRows(result);

            expect(simplified[0].type).toBe('SEPARATOR');
            const dataRows = simplified.filter(r => r.type === 'DATA');
            expect(dataRows.some(r => r.id === 'row_50')).toBe(true);
            expect(simplified[simplified.length - 1].type).toBe('SEPARATOR');
        });
    });

    describe('with top pinning', () => {
        it('should always include top-pinned rows regardless of scroll position', () => {
            const rows = [createDynamicBlock(100, 30, borderWidth)];
            const pinning = { top: 3, bottom: 0, left: 0, right: 0 };
            const rowSpan = 30 + borderWidth;
            const fixedTop = borderWidth + 3 * rowSpan;
            const scrollRect = { top: 50 * rowSpan, left: 0, width: 500, height: 100 };
            const fixedSize = { top: fixedTop, bottom: 0, left: 0, right: 0 };

            const result = getStaticRows(data, rows, pinning, scrollRect, fixedSize, borderWidth);
            const simplified = simplifyRows(result);

            expect(simplified[0]).toEqual({ type: 'DATA', id: 'row_0', height: 30 });
            expect(simplified[1]).toEqual({ type: 'DATA', id: 'row_1', height: 30 });
            expect(simplified[2]).toEqual({ type: 'DATA', id: 'row_2', height: 30 });
        });
    });

    describe('with bottom pinning', () => {
        it('should always include bottom-pinned rows regardless of scroll position', () => {
            const rows = [createDynamicBlock(100, 30, borderWidth)];
            const pinning = { top: 0, bottom: 2, left: 0, right: 0 };
            const scrollRect = { top: 0, left: 0, width: 500, height: 100 };
            const fixedSize = { top: borderWidth, bottom: 0, left: 0, right: 0 };

            const result = getStaticRows(data, rows, pinning, scrollRect, fixedSize, borderWidth);
            const simplified = simplifyRows(result);

            const dataRows = simplified.filter(r => r.type === 'DATA');
            expect(dataRows[dataRows.length - 1].id).toBe('row_99');
            expect(dataRows[dataRows.length - 2].id).toBe('row_98');
        });
    });

    describe('with both top and bottom pinning', () => {
        it('should include both pinned regions with separators in between', () => {
            const rows = [createDynamicBlock(100, 30, borderWidth)];
            const pinning = { top: 2, bottom: 2, left: 0, right: 0 };
            const rowSpan = 30 + borderWidth;
            const fixedTop = borderWidth + 2 * rowSpan;
            const scrollRect = { top: 40 * rowSpan, left: 0, width: 500, height: 100 };
            const fixedSize = { top: fixedTop, bottom: 0, left: 0, right: 0 };

            const result = getStaticRows(data, rows, pinning, scrollRect, fixedSize, borderWidth);
            const simplified = simplifyRows(result);

            expect(simplified[0].id).toBe('row_0');
            expect(simplified[1].id).toBe('row_1');

            const dataRows = simplified.filter(r => r.type === 'DATA');
            expect(dataRows[dataRows.length - 1].id).toBe('row_99');
            expect(dataRows[dataRows.length - 2].id).toBe('row_98');
        });

        it('should merge ranges when visible area is adjacent to pinned area', () => {
            const rows = [createDynamicBlock(10, 30, borderWidth)];
            const pinning = { top: 2, bottom: 2, left: 0, right: 0 };
            const rowSpan = 30 + borderWidth;
            const fixedTop = borderWidth + 2 * rowSpan;
            const scrollRect = { top: 0, left: 0, width: 500, height: 200 };
            const fixedSize = { top: fixedTop, bottom: 0, left: 0, right: 0 };

            const result = getStaticRows(data, rows, pinning, scrollRect, fixedSize, borderWidth);
            const simplified = simplifyRows(result);

            const separators = simplified.filter(r => r.type === 'SEPARATOR');
            expect(separators.length).toBeLessThanOrEqual(1);
        });
    });

    describe('with multiple dynamic blocks', () => {
        it('should handle multiple dynamic blocks correctly', () => {
            const rows = [
                createDynamicBlock(50, 30, borderWidth),
                createDynamicBlock(50, 30, borderWidth),
            ];
            const pinning = { top: 0, bottom: 0, left: 0, right: 0 };
            const scrollRect = { top: 0, left: 0, width: 500, height: 100 };
            const fixedSize = { top: borderWidth, bottom: 0, left: 0, right: 0 };

            const result = getStaticRows(data, rows, pinning, scrollRect, fixedSize, borderWidth);
            const simplified = simplifyRows(result);

            expect(simplified[0].id).toBe('row_0');
            expect(simplified.some(r => r.type === 'SEPARATOR')).toBe(true);
        });
    });

    describe('with mixed static and dynamic rows', () => {
        it('should pass through static rows and expand dynamic blocks', () => {
            const rows = [
                createStaticRow('header', 40),
                createDynamicBlock(100, 30, borderWidth),
                createStaticRow('footer', 40),
            ];
            const pinning = { top: 0, bottom: 0, left: 0, right: 0 };
            const scrollRect = { top: 0, left: 0, width: 500, height: 150 };
            const fixedSize = { top: borderWidth, bottom: 0, left: 0, right: 0 };

            const result = getStaticRows(data, rows, pinning, scrollRect, fixedSize, borderWidth);
            const simplified = simplifyRows(result);

            expect(simplified[0]).toEqual({ type: 'DATA', id: 'header', height: 40 });
            expect(simplified[simplified.length - 1]).toEqual({ type: 'DATA', id: 'footer', height: 40 });
            expect(simplified.length).toBeGreaterThan(2);
        });

        it('should handle static rows with pinning that spans into dynamic block', () => {
            const rows = [
                createStaticRow('header', 40),
                createDynamicBlock(100, 30, borderWidth),
            ];
            const pinning = { top: 3, bottom: 0, left: 0, right: 0 };
            const rowSpan = 30 + borderWidth;
            const fixedTop = borderWidth + 40 + borderWidth + 2 * rowSpan;
            const scrollRect = { top: 50 * rowSpan, left: 0, width: 500, height: 100 };
            const fixedSize = { top: fixedTop, bottom: 0, left: 0, right: 0 };

            const result = getStaticRows(data, rows, pinning, scrollRect, fixedSize, borderWidth);
            const simplified = simplifyRows(result);

            expect(simplified[0].id).toBe('header');
            expect(simplified[1].id).toBe('row_0');
            expect(simplified[2].id).toBe('row_1');
        });
    });

    describe('edge cases', () => {
        it('should handle empty dynamic block', () => {
            const rows = [createDynamicBlock(0, 30, borderWidth)];
            const pinning = { top: 0, bottom: 0, left: 0, right: 0 };
            const scrollRect = { top: 0, left: 0, width: 500, height: 300 };
            const fixedSize = { top: borderWidth, bottom: 0, left: 0, right: 0 };

            const result = getStaticRows(data, rows, pinning, scrollRect, fixedSize, borderWidth);

            expect(result.length).toBe(0);
        });

        it('should handle scroll position beyond content', () => {
            const rows = [createDynamicBlock(10, 30, borderWidth)];
            const pinning = { top: 0, bottom: 0, left: 0, right: 0 };
            const rowSpan = 30 + borderWidth;
            const scrollRect = { top: 1000 * rowSpan, left: 0, width: 500, height: 300 };
            const fixedSize = { top: borderWidth, bottom: 0, left: 0, right: 0 };

            const result = getStaticRows(data, rows, pinning, scrollRect, fixedSize, borderWidth);
            const simplified = simplifyRows(result);

            expect(simplified.length).toBe(1);
            expect(simplified[0].type).toBe('SEPARATOR');
        });

        it('should handle when all rows are pinned', () => {
            const rows = [createDynamicBlock(5, 30, borderWidth)];
            const pinning = { top: 3, bottom: 2, left: 0, right: 0 };
            const scrollRect = { top: 0, left: 0, width: 500, height: 300 };
            const fixedSize = { top: borderWidth, bottom: 0, left: 0, right: 0 };

            const result = getStaticRows(data, rows, pinning, scrollRect, fixedSize, borderWidth);
            const simplified = simplifyRows(result);

            expect(simplified.length).toBe(5);
            expect(simplified.every(r => r.type === 'DATA')).toBe(true);
            expect(simplified[0].id).toBe('row_0');
            expect(simplified[4].id).toBe('row_4');
        });

        it('should handle large number of rows efficiently', () => {
            const rows = [createDynamicBlock(1000000, 30, borderWidth)];
            const pinning = { top: 2, bottom: 2, left: 0, right: 0 };
            const rowSpan = 30 + borderWidth;
            const fixedTop = borderWidth + 2 * rowSpan;
            const scrollRect = { top: 500000 * rowSpan, left: 0, width: 500, height: 300 };
            const fixedSize = { top: fixedTop, bottom: 0, left: 0, right: 0 };

            const startTime = performance.now();
            const result = getStaticRows(data, rows, pinning, scrollRect, fixedSize, borderWidth);
            const endTime = performance.now();

            expect(endTime - startTime).toBeLessThan(100);
            expect(result.length).toBeLessThan(50);

            const simplified = simplifyRows(result);
            expect(simplified[0].id).toBe('row_0');
            expect(simplified[1].id).toBe('row_1');
            expect(simplified[simplified.length - 1].id).toBe('row_999999');
            expect(simplified[simplified.length - 2].id).toBe('row_999998');
        });
    });

    describe('separator height calculation', () => {
        it('should calculate separator height correctly', () => {
            const rows = [createDynamicBlock(100, 30, borderWidth)];
            const pinning = { top: 0, bottom: 0, left: 0, right: 0 };
            const rowSpan = 30 + borderWidth;
            const scrollRect = { top: 50 * rowSpan, left: 0, width: 500, height: 4 * rowSpan };
            const fixedSize = { top: borderWidth, bottom: 0, left: 0, right: 0 };

            const result = getStaticRows(data, rows, pinning, scrollRect, fixedSize, borderWidth);
            const separators = result.filter(r => r.type === 'SEPARATOR');

            expect(separators[0].height).toBe(50 * 30 + 49 * borderWidth);
        });
    });
});
