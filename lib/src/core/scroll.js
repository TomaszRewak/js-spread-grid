/** @import * as Types from "../typings.js"; */

/**
 * @param {Types.ScrollSpeedStep[]} speed
 * @param {number} distance
 * @returns {Types.ScrollSpeed}
 */
function getSpeedValue(speed, distance) {
    const absDistance = Math.abs(distance);
    for (const entry of speed) {
        if (absDistance <= entry.maxDistance)
            return entry.scrollSpeed;
    }

    return 'auto';
}


/**
 * @param {Types.Context} context
 */
function cancelScrollAnimation(context) {
    const element = context.element;

    if (context.scrollAnimationId) {
        cancelAnimationFrame(context.scrollAnimationId);
        context.scrollAnimationId = null;
        element.scrollTop = element.scrollTop;
        element.scrollLeft = element.scrollLeft;
    }
}

/**
 * @param {number} diff
 * @param {number} speed
 * @param {number} dt
 * @param {number} fractionalProgress
 * @returns {number}
 */
function getStep(diff, speed, dt, fractionalProgress) {
    return diff > 0
        ? Math.min(diff, speed * dt + fractionalProgress)
        : Math.max(diff, -speed * dt + fractionalProgress);
}

/**
 * @param {number} target
 * @param {number} clientSize
 * @param {number} scrollSize
 * @returns {number}
 */
function clipTarget(target, clientSize, scrollSize) {
    return Math.max(0, Math.min(target, scrollSize - clientSize - 1));
}

/**
 * @param {'top' | 'left'} axis
 * @param {number} dt
 * @param {number} currentPosition
 * @param {number} target
 * @param {number} clientSize
 * @param {number} scrollSize
 * @param {number} previousTarget
 * @param {number} previousOffset
 * @param {Types.ScrollSpeedStep[]} speedSteps
 * @param {number} fractionalProgress
 * @param {boolean} snap
 * @returns {ScrollToOptions & {behavior?: 'auto'} | null}
 */
function getOptions(axis, dt, currentPosition, target, clientSize, scrollSize, previousTarget, previousOffset, speedSteps, fractionalProgress, snap) {
    if (target === null)
        return null;

    const diff = target - currentPosition;

    if (Math.abs(diff) < 1)
        return null;

    if (diff < 0 && currentPosition === 0)
        return null;

    if (diff > 0 && currentPosition >= scrollSize - clientSize - 1)
        return null;

    const speed = getSpeedValue(speedSteps, diff);

    if (snap || speed === 'auto')
        return { [axis]: target, behavior: 'auto' };

    if (typeof speed === 'number')
        return { [axis]: currentPosition + getStep(diff, speed, dt, fractionalProgress), behavior: 'auto' };

    if (previousTarget !== target || previousOffset === currentPosition)
        return { [axis]: target };

    return null;
}

/**
 * @param {Types.Context} context
 * @param {number} dt
 * @param {ScrollToOptions} previousTarget
 * @param {Types.ScrollOffset} previousOffset
 * @param {number} fractionalProgress
 * @param {boolean} snap
 * @returns {ScrollToOptions & {behavior?: 'auto'}}
 */
function getVerticalOptions(context, dt, previousTarget, previousOffset, fractionalProgress, snap) {
    const element = context.element;
    const scrollState = context.state.scrollState;
    const target = scrollState.verticalTarget;
    const currentPosition = element.scrollTop;
    const clientSize = element.clientHeight;
    const scrollSize = element.scrollHeight;

    return getOptions('top', dt, currentPosition, target, clientSize, scrollSize, previousTarget?.top, previousOffset.top, scrollState.verticalSpeed, fractionalProgress, snap);
}

/**
 * @param {Types.Context} context
 * @param {number} dt
 * @param {ScrollToOptions} previousTarget
 * @param {Types.ScrollOffset} previousOffset
 * @param {number} fractionalProgress
 * @param {boolean} snap
 * @returns {ScrollToOptions & {behavior?: 'auto'}}
 */
function getHorizontalOptions(context, dt, previousTarget, previousOffset, fractionalProgress, snap) {
    const element = context.element;
    const scrollState = context.state.scrollState;
    const target = scrollState.horizontalTarget;
    const currentPosition = element.scrollLeft;
    const clientSize = element.clientWidth;
    const scrollSize = element.scrollWidth;

    return getOptions('left', dt, currentPosition, target, clientSize, scrollSize, previousTarget?.left, previousOffset.left, scrollState.horizontalSpeed, fractionalProgress, snap);
}

/**
 * @param {Types.Context} context
 */
export default function scroll(context) {
    const element = context.element;
    const scrollState = context.state.scrollState;
    const targetV = scrollState.verticalTarget;
    const targetH = scrollState.horizontalTarget;

    if (targetV === null && targetH === null || !element.isConnected) {
        cancelScrollAnimation(context);
        return;
    }

    if (context.scrollAnimationId) {
        return;
    }

    let lastTime = performance.now();
    let previousOptionsH = /** @type {ScrollToOptions|null} */ (null);
    let previousOptionsV = /** @type {ScrollToOptions|null} */ (null);
    let previousOffset = { top: element.scrollTop, left: element.scrollLeft };
    let fractionalVerticalProgress = 0;
    let fractionalHorizontalProgress = 0;

    /** @param {number} now */
    const animate = (now) => {
        const targetV = context.state.scrollState.verticalTarget;
        const targetH = context.state.scrollState.horizontalTarget;

        if (targetV === null && targetH === null || !element.isConnected) {
            cancelScrollAnimation(context);
            return;
        }

        if (targetV === null)
            previousOptionsV = null;
        if (targetH === null)
            previousOptionsH = null;

        const dt = (now - lastTime) / 1000;
        lastTime = now;

        const snap = context.lastScrollClientSizeVersion !== context.state.scrollState.clientSizeVersion;
        context.lastScrollClientSizeVersion = context.state.scrollState.clientSizeVersion;

        const newOptionsV = getVerticalOptions(context, dt, previousOptionsV, previousOffset, fractionalVerticalProgress, snap);
        const newOptionsH = getHorizontalOptions(context, dt, previousOptionsH, previousOffset, fractionalHorizontalProgress, snap);
        const newOptions = {
            ...previousOptionsV,
            ...previousOptionsH,
            behavior: /** @type {Types.ScrollBehavior} */('smooth'),
            ...newOptionsV,
            ...newOptionsH
        };

        if (newOptionsV || newOptionsH) {
            element.scrollTo(newOptions);
        }

        if (newOptionsV && newOptions.behavior === 'auto') {
            fractionalVerticalProgress = newOptions.top - element.scrollTop;
        } else {
            fractionalVerticalProgress = 0;
        }

        if (newOptionsH && newOptions.behavior === 'auto') {
            fractionalHorizontalProgress = newOptions.left - element.scrollLeft;
        } else {
            fractionalHorizontalProgress = 0;
        }

        previousOptionsV = newOptionsV || previousOptionsV;
        previousOptionsH = newOptionsH || previousOptionsH;
        previousOffset = { top: element.scrollTop, left: element.scrollLeft };

        context.scrollAnimationId = requestAnimationFrame(animate);
    };

    animate(lastTime);
}