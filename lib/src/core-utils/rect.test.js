import { contains, clip, expand, area, subtract } from './rect.js';

describe('contains', () => {
    it('should return true if rect is fully contained within bounds', () => {
        const bounds = { top: 0, left: 0, width: 10, height: 10 };
        const rect = { top: 2, left: 2, width: 4, height: 4 };
        expect(contains(bounds, rect)).toBe(true);
    });

    it('should return false if rect is partially outside of bounds', () => {
        const bounds = { top: 0, left: 0, width: 10, height: 10 };
        const rect = { top: 8, left: 8, width: 4, height: 4 };
        expect(contains(bounds, rect)).toBe(false);
    });

    it('should return false if rect is completely outside of bounds', () => {
        const bounds = { top: 0, left: 0, width: 10, height: 10 };
        const rect = { top: 12, left: 12, width: 4, height: 4 };
        expect(contains(bounds, rect)).toBe(false);
    });

    it('should return true if rect is equal to bounds', () => {
        const bounds = { top: 0, left: 0, width: 10, height: 10 };
        const rect = { top: 0, left: 0, width: 10, height: 10 };
        expect(contains(bounds, rect)).toBe(true);
    });
});

describe('clip', () => {
    it('should return the clipped rectangle when rect is partially outside of bounds', () => {
        const bounds = { top: 0, left: 0, width: 10, height: 10 };
        const rect = { top: 8, left: 8, width: 4, height: 4 };
        const expected = { top: 8, left: 8, width: 2, height: 2 };
        expect(clip(bounds, rect)).toEqual(expected);
    });

    it('should return the clipped rectangle when rect is completely outside of bounds', () => {
        const bounds = { top: 0, left: 0, width: 10, height: 10 };
        const rect = { top: 12, left: 12, width: 4, height: 4 };
        const expected = { top: 0, left: 0, width: 0, height: 0 };
        expect(clip(bounds, rect)).toEqual(expected);
    });

    it('should return the clipped rectangle when rect is partially inside bounds', () => {
        const bounds = { top: 0, left: 0, width: 10, height: 10 };
        const rect = { top: 2, left: 2, width: 8, height: 8 };
        const expected = { top: 2, left: 2, width: 8, height: 8 };
        expect(clip(bounds, rect)).toEqual(expected);
    });

    it('should return the clipped rectangle when rect is equal to bounds', () => {
        const bounds = { top: 0, left: 0, width: 10, height: 10 };
        const rect = { top: 0, left: 0, width: 10, height: 10 };
        const expected = { top: 0, left: 0, width: 10, height: 10 };
        expect(clip(bounds, rect)).toEqual(expected);
    });
});

describe('expand', () => {
    it('should expand the rectangle by the specified margin', () => {
        const rect = { top: 10, left: 20, width: 30, height: 40 };
        const margin = 5;
        const expandedRect = expand(rect, margin);

        expect(expandedRect.top).toBe(5);
        expect(expandedRect.left).toBe(15);
        expect(expandedRect.width).toBe(40);
        expect(expandedRect.height).toBe(50);
    });

    it('should expand the rectangle even if values become negative', () => {
        const rect = { top: 10, left: 20, width: 30, height: 40 };
        const margin = 15;
        const expandedRect = expand(rect, margin);

        expect(expandedRect.top).toBe(-5);
        expect(expandedRect.left).toBe(5);
        expect(expandedRect.width).toBe(60);
        expect(expandedRect.height).toBe(70);
    });
});

describe('area', () => {
    it('should return the area of the rectangle', () => {
        const rect = { top: 10, left: 20, width: 30, height: 40 };
        expect(area(rect)).toBe(1200);
    });
});

describe('subtract', () => {
    it('should subtract the margin from the rectangle', () => {
        const rect = { top: 10, left: 20, width: 30, height: 40 };
        const margin = { top: 5, right: 10, bottom: 5, left: 10 };
        const expected = { top: 10, left: 20, width: 10, height: 30 };
        expect(subtract(rect, margin)).toEqual(expected);
    });

    it('should handle negative values when subtracting the margin', () => {
        const rect = { top: 10, left: 20, width: 30, height: 40 };
        const margin = { top: 15, right: 25, bottom: 15, left: 25 };
        const expected = { top: 10, left: 20, width: 0, height: 10 };
        expect(subtract(rect, margin)).toEqual(expected);
    });

    it('should not modify the original rectangle', () => {
        const rect = { top: 10, left: 20, width: 30, height: 40 };
        const margin = { top: 5, right: 10, bottom: 5, left: 10 };
        subtract(rect, margin);
        expect(rect).toEqual({ top: 10, left: 20, width: 30, height: 40 });
    });
});