/** @import * as Types from "../typings.js"; */

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
 * @param {Types.Context} context
 * @param {number} dt
 * @param {ScrollToOptions} previousTarget
 * @param {Types.ScrollOffset} previousOffset
 * @param {number} fractionalProgress
 * @returns {ScrollToOptions}
 */
function getVerticalTarget(context, dt, previousTarget, previousOffset, fractionalProgress) {
    const element = context.element;
    const target = context.state.activeVerticalScroll;
    const speed = target.speed;
    const currentPosition = element.scrollTop;
    const diff = target.offset - currentPosition;

    if (Math.abs(diff) < 1) {
        return null;
    }

    if (target.snapVersion !== context.scrollSnapVersionVertical) {
        context.scrollSnapVersionVertical = target.snapVersion;
        return { top: target.offset, behavior: 'auto' };
    }

    if (speed) {
        const step = diff > 0
            ? Math.min(diff, speed * dt + fractionalProgress)
            : Math.max(diff, -speed * dt + fractionalProgress);
        const targetPosition = currentPosition + step;
        return { top: targetPosition, behavior: 'auto' };
    }

    if (previousTarget?.top !== target.offset || previousOffset.top === currentPosition) {
        return { top: target.offset };
    }

    return null;
}

/**
 * @param {Types.Context} context
 */
export default function scroll(context) {
    const element = context.element;
    const targetV = context.state.activeVerticalScroll;
    const targetH = context.state.activeHorizontalScroll;

    if (!targetV && !targetH) {
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
        const targetV = context.state.activeVerticalScroll;
        const targetH = context.state.activeHorizontalScroll;

        if (!targetV && !targetH || !element.isConnected) {
            cancelScrollAnimation(context);
            return;
        }

        const dt = (now - lastTime) / 1000;
        lastTime = now;

        const newTarget = getVerticalTarget(context, dt, previousTarget, previousOffset, fractionalVerticalProgress);

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