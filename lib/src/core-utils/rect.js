/**
 * @param {Rect} bounds
 * @param {Rect} rect
 * @returns {boolean}
 */
export function contains(bounds, rect) {
    return (
        rect.top >= bounds.top &&
        rect.left >= bounds.left &&
        rect.top + rect.height <= bounds.top + bounds.height &&
        rect.left + rect.width <= bounds.left + bounds.width
    );
}

/**
 * @param {Rect} bounds
 * @param {Rect} rect
 * @returns {Rect}
 */
export function clip(bounds, rect) {
    const newRect = {
        top: Math.max(bounds.top, rect.top),
        left: Math.max(bounds.left, rect.left),
        width: Math.min(bounds.left + bounds.width, rect.left + rect.width) - Math.max(bounds.left, rect.left),
        height: Math.min(bounds.top + bounds.height, rect.top + rect.height) - Math.max(bounds.top, rect.top)
    };

    if (newRect.width >= 0 && newRect.height >= 0)
        return newRect;

    return {
        top: bounds.top,
        left: bounds.left,
        width: 0,
        height: 0
    }
}

/**
 * @param {Rect} rect
 * @param {number} margin
 * @returns {Rect}
 */
export function expand(rect, margin) {
    return {
        top: rect.top - margin,
        left: rect.left - margin,
        width: rect.width + margin * 2,
        height: rect.height + margin * 2
    };
}

/**
 * @param {Rect} rect
 * @returns {number}
 */
export function area(rect) {
    return rect.width * rect.height;
}

/**
 * @param {Rect} rect
 * @param {Margin} margin
 * @returns {Rect}
 */
export function subtract(rect, margin) {
    return {
        top: rect.top,
        left: rect.left,
        width: Math.max(0, rect.width - margin.left - margin.right),
        height: Math.max(0, rect.height - margin.top - margin.bottom)
    };
}