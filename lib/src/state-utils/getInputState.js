/** @import * as Types from "../typings.js"; */

/**
 * @param {Types.ElementPlacement} inputPlacement
 * @param {boolean} isTextValid
 * @returns {Types.InputState}
 */
export default function getInputState(inputPlacement, isTextValid) {
    return { inputPlacement, isTextValid };
}
