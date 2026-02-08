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
 * @param {number} dt
 * @param {number} currentPosition
 * @param {number} target
 * @param {number} previousTarget
 * @param {number} previousOffset
 * @param {Types.ScrollSpeedStep[]} speedSteps
 * @param {number} fractionalProgress
 * @param {boolean} snap
 * @returns {ScrollToOptions & {behavior?: 'auto'} | null}
 */
function getTarget(dt, currentPosition, target, previousTarget, previousOffset, speedSteps, fractionalProgress, snap) {
    const diff = target - currentPosition;
    const speed = getSpeedValue(speedSteps, diff);

    if (Math.abs(diff) < 1)
        return null;

    if (snap || speed === 'auto')
        return { top: target, behavior: 'auto' };

    if (typeof speed === 'number')
        return { top: currentPosition + getStep(diff, speed, dt, fractionalProgress), behavior: 'auto' };

    if (previousTarget !== target || previousOffset === currentPosition)
        return { top: target };

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
function getVerticalTarget(context, dt, previousTarget, previousOffset, fractionalProgress, snap) {
    const element = context.element;
    const scrollState = context.state.scrollState;
    const target = scrollState.verticalTarget;
    const currentPosition = element.scrollTop;

    return getTarget(dt, currentPosition, target, previousTarget?.top, previousOffset.top, scrollState.verticalSpeed, fractionalProgress, snap);
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
function getHorizontalTarget(context, dt, previousTarget, previousOffset, fractionalProgress, snap) {
    const element = context.element;
    const scrollState = context.state.scrollState;
    const target = scrollState.horizontalTarget;
    const currentPosition = element.scrollLeft;

    return getTarget(dt, currentPosition, target, previousTarget?.left, previousOffset.left, scrollState.horizontalSpeed, fractionalProgress, snap);
}

/**
 * @param {Types.Context} context
 */
export default function scroll(context) {
    const element = context.element;
    const scrollState = context.state.scrollState;
    const targetV = scrollState.verticalTarget;
    const targetH = scrollState.horizontalTarget;

    if (targetV === null && targetH === null) {
        cancelScrollAnimation(context);
        return;
    }

    if (context.scrollAnimationId) {
        return;
    }

    let lastTime = performance.now();
    let previousTarget = /** @type {ScrollToOptions|null} */ (null);
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

        const dt = (now - lastTime) / 1000;
        lastTime = now;

        const snap = context.lastScrollClientSizeVersion !== context.state.scrollState.clientSizeVersion;
        context.lastScrollClientSizeVersion = context.state.scrollState.clientSizeVersion;

        const newTarget = getVerticalTarget(context, dt, previousTarget, previousOffset, fractionalVerticalProgress, snap);

        if (newTarget) {
            element.scrollTo({ behavior: 'smooth', ...newTarget });
        }

        if (newTarget?.behavior === 'auto') {
            fractionalVerticalProgress = newTarget.top - element.scrollTop;
            fractionalHorizontalProgress = newTarget.left - element.scrollLeft;
        } else {
            fractionalVerticalProgress = 0;
            fractionalHorizontalProgress = 0;
        }

        previousTarget = newTarget;
        previousOffset = { top: element.scrollTop, left: element.scrollLeft };

        context.scrollAnimationId = requestAnimationFrame(animate);
    };

    animate(lastTime);
}