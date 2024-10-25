/**
 * @param {number} top
 * @param {number} bottom
 * @param {number} left
 * @param {number} right
 * @returns {FixedSize}
 */
export default function getFixedSize(top, bottom, left, right) {
    return {
        top: top,
        bottom: bottom,
        left: left,
        right: right
    };
}
