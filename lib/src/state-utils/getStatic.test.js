/** @import * as Types from "../typings.js"; */

import stringifyId from '../core-utils/stringifyId.js';
import { getStaticRows } from './getStatic.js';

/**
 * @param {string} id
 * @param {number} height
 * @returns {Types.MeasuredStaticRow}
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
 * @param {string} [prefix]
 * @returns {Types.MeasuredRow}
 */
function createDynamicBlock(count, rowHeight, borderWidth, prefix = 'row') {
    return {
        type: 'DYNAMIC-BLOCK',
        index: 0,
        labels: [],
        count,
        rowHeight,
        height: count * rowHeight + (count - 1) * borderWidth,
        id: ({ selector }) => `${prefix}_${selector}`,
        selector: ({ index }) => index,
        header: ({ selector }) => `${prefix} ${selector}`,
    };
}

/**
 * @param {Types.MeasuredStaticRow[]} rows
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

        it('should have exactly two separators when scrolled to middle with both pinnings', () => {
            const rows = [createDynamicBlock(100, 30, borderWidth)];
            const pinning = { top: 2, bottom: 2, left: 0, right: 0 };
            const rowSpan = 30 + borderWidth;
            const fixedTop = borderWidth + 2 * rowSpan;
            const scrollRect = { top: 40 * rowSpan, left: 0, width: 500, height: 3 * rowSpan };
            const fixedSize = { top: fixedTop, bottom: 0, left: 0, right: 0 };

            const result = getStaticRows(data, rows, pinning, scrollRect, fixedSize, borderWidth);
            const simplified = simplifyRows(result);
            const separators = simplified.filter(r => r.type === 'SEPARATOR');

            expect(separators.length).toBe(2);
        });

        it('should place separator immediately after top-pinned rows', () => {
            const rows = [createDynamicBlock(100, 30, borderWidth)];
            const pinning = { top: 2, bottom: 2, left: 0, right: 0 };
            const rowSpan = 30 + borderWidth;
            const fixedTop = borderWidth + 2 * rowSpan;
            const scrollRect = { top: 40 * rowSpan, left: 0, width: 500, height: 3 * rowSpan };
            const fixedSize = { top: fixedTop, bottom: 0, left: 0, right: 0 };

            const result = getStaticRows(data, rows, pinning, scrollRect, fixedSize, borderWidth);
            const simplified = simplifyRows(result);

            expect(simplified[0].type).toBe('DATA');
            expect(simplified[0].id).toBe('row_0');
            expect(simplified[1].type).toBe('DATA');
            expect(simplified[1].id).toBe('row_1');
            expect(simplified[2].type).toBe('SEPARATOR');
        });

        it('should place separator immediately before bottom-pinned rows', () => {
            const rows = [createDynamicBlock(100, 30, borderWidth)];
            const pinning = { top: 2, bottom: 2, left: 0, right: 0 };
            const rowSpan = 30 + borderWidth;
            const fixedTop = borderWidth + 2 * rowSpan;
            const scrollRect = { top: 40 * rowSpan, left: 0, width: 500, height: 3 * rowSpan };
            const fixedSize = { top: fixedTop, bottom: 0, left: 0, right: 0 };

            const result = getStaticRows(data, rows, pinning, scrollRect, fixedSize, borderWidth);
            const simplified = simplifyRows(result);

            const lastIndex = simplified.length - 1;
            expect(simplified[lastIndex].type).toBe('DATA');
            expect(simplified[lastIndex].id).toBe('row_99');
            expect(simplified[lastIndex - 1].type).toBe('DATA');
            expect(simplified[lastIndex - 1].id).toBe('row_98');
            expect(simplified[lastIndex - 2].type).toBe('SEPARATOR');
        });

        it('should have separators spanning correct number of hidden rows', () => {
            const rows = [createDynamicBlock(100, 30, borderWidth)];
            const pinning = { top: 2, bottom: 2, left: 0, right: 0 };
            const rowSpan = 30 + borderWidth;
            const fixedTop = borderWidth + 2 * rowSpan;
            const scrollRect = { top: 50 * rowSpan, left: 0, width: 500, height: 3 * rowSpan };
            const fixedSize = { top: fixedTop, bottom: 0, left: 0, right: 0 };

            const result = getStaticRows(data, rows, pinning, scrollRect, fixedSize, borderWidth);
            const simplified = simplifyRows(result);
            const separators = simplified.filter(r => r.type === 'SEPARATOR');
            const dataRows = simplified.filter(r => r.type === 'DATA');

            const topPinnedRows = dataRows.slice(0, 2);
            const visibleRows = dataRows.slice(2, -2);
            const bottomPinnedRows = dataRows.slice(-2);

            expect(topPinnedRows.map(r => r.id)).toEqual(['row_0', 'row_1']);
            expect(bottomPinnedRows.map(r => r.id)).toEqual(['row_98', 'row_99']);

            const firstVisibleId = parseInt(visibleRows[0].id.replace('row_', ''));
            const lastVisibleId = parseInt(visibleRows[visibleRows.length - 1].id.replace('row_', ''));

            const topSeparatorSpan = firstVisibleId - 2;
            const bottomSeparatorSpan = 98 - lastVisibleId - 1;

            expect(separators[0].height).toBe(topSeparatorSpan * 30 + (topSeparatorSpan - 1) * borderWidth);
            expect(separators[1].height).toBe(bottomSeparatorSpan * 30 + (bottomSeparatorSpan - 1) * borderWidth);

            expect(topSeparatorSpan).toBeGreaterThan(1);
            expect(bottomSeparatorSpan).toBeGreaterThan(1);

            const absoluteScrollTop = scrollRect.top + fixedTop;
            const absoluteScrollBottom = absoluteScrollTop + scrollRect.height;
            const firstVisibleRowTop = borderWidth + firstVisibleId * rowSpan;
            const firstVisibleRowBottom = firstVisibleRowTop + 30;
            const lastVisibleRowTop = borderWidth + lastVisibleId * rowSpan;
            const lastVisibleRowBottom = lastVisibleRowTop + 30;

            expect(firstVisibleRowBottom).toBeGreaterThan(absoluteScrollTop);
            expect(firstVisibleRowTop).toBeLessThan(absoluteScrollBottom);
            expect(lastVisibleRowBottom).toBeGreaterThan(absoluteScrollTop);
            expect(lastVisibleRowTop).toBeLessThanOrEqual(absoluteScrollBottom);
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

        it('should show rows from both blocks when scroll spans boundary with pinning', () => {
            const rows = [
                createDynamicBlock(50, 30, borderWidth, 'blockA'),
                createDynamicBlock(50, 30, borderWidth, 'blockB'),
            ];
            const pinning = { top: 2, bottom: 2, left: 0, right: 0 };
            const rowSpan = 30 + borderWidth;
            const fixedTop = borderWidth + 2 * rowSpan;
            const scrollRect = { top: 45 * rowSpan, left: 0, width: 500, height: 10 * rowSpan };
            const fixedSize = { top: fixedTop, bottom: 0, left: 0, right: 0 };

            const result = getStaticRows(data, rows, pinning, scrollRect, fixedSize, borderWidth);
            const simplified = simplifyRows(result);
            const dataRows = simplified.filter(r => r.type === 'DATA');
            const separators = simplified.filter(r => r.type === 'SEPARATOR');

            const blockARows = dataRows.filter(r => r.id.startsWith('blockA_'));
            const blockBRows = dataRows.filter(r => r.id.startsWith('blockB_'));

            expect(blockARows.length).toBeGreaterThan(0);
            expect(blockBRows.length).toBeGreaterThan(0);

            expect(blockARows[0].id).toBe('blockA_0');
            expect(blockARows[1].id).toBe('blockA_1');

            expect(blockBRows[blockBRows.length - 1].id).toBe('blockB_49');
            expect(blockBRows[blockBRows.length - 2].id).toBe('blockB_48');

            expect(separators.length).toBeGreaterThanOrEqual(2);

            const visibleBlockARows = blockARows.filter(r => {
                const idx = parseInt(r.id.replace('blockA_', ''));
                return idx >= 2;
            });
            const visibleBlockBRows = blockBRows.filter(r => {
                const idx = parseInt(r.id.replace('blockB_', ''));
                return idx < 48;
            });
            expect(visibleBlockARows.length).toBeGreaterThan(0);
            expect(visibleBlockBRows.length).toBeGreaterThan(0);
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
