/** @import * as Types from "../typings.js"; */

/**
 * @param {Types.ScrollSpeedConfig} scrollSpeedConfig
 * @returns {Types.ScrollSpeedStep[]}
 */
export default function getResolvedScrollSpeed(scrollSpeedConfig) {
    if (!scrollSpeedConfig) {
        return [{
            maxDistance: Infinity,
            scrollSpeed: 'smooth'
        }];
    }

    if (typeof scrollSpeedConfig === 'number') {
        return [{
            maxDistance: Infinity,
            scrollSpeed: scrollSpeedConfig
        }];
    }

    if (typeof scrollSpeedConfig === 'string') {
        return [{
            maxDistance: Infinity,
            scrollSpeed: scrollSpeedConfig
        }];
    }

    if (scrollSpeedConfig.length === 0) {
        return [{
            maxDistance: Infinity,
            scrollSpeed: 'smooth'
        }];
    }

    return scrollSpeedConfig.sort((a, b) => a.maxDistance - b.maxDistance);
}