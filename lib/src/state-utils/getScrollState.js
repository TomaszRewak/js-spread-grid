/** @import * as Types from "../typings.js"; */

/**
 * @param {number | null} verticalTarget
 * @param {number | null} horizontalTarget
 * @param {Types.ScrollSpeedStep[]} verticalSpeed
 * @param {Types.ScrollSpeedStep[]} horizontalSpeed
 * @param {number} clientSizeVersion
 * @returns {Types.ScrollState}
 */
export default function getScrollState(verticalTarget, horizontalTarget, verticalSpeed, horizontalSpeed, clientSizeVersion) {
    return {
        verticalTarget,
        horizontalTarget,
        verticalSpeed,
        horizontalSpeed,
        clientSizeVersion
    };
}