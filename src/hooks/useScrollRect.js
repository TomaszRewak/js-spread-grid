import { useEffect, useState } from "react";
import { area, clip, contains, expand, subtract } from "../utils/rect";

// TODO: Write unit tests

const requiredMargin = 200;
const preloadedMargin = 400;
const emptyRect = {
    left: 0,
    top: 0,
    width: 0,
    height: 0
};

function getBounds(fixedLeft, fixedTop) {
    return {
        left: 0,
        top: 0,
        width: fixedTop ? fixedTop.getBoundingClientRect().width : 0,
        height: fixedLeft ? fixedLeft.getBoundingClientRect().height : 0
    };
}

function getScrollRect(element) {
    return {
        left: element.scrollLeft,
        top: element.scrollTop,
        width: element.getBoundingClientRect().width,
        height: element.getBoundingClientRect().height
    };
}

function getFixedMargin(fixedLeft, fixedTop, fixedRight, fixedBottom) {
    return {
        left: fixedLeft ? fixedLeft.getBoundingClientRect().width : 0,
        top: fixedTop ? fixedTop.getBoundingClientRect().height : 0,
        right: fixedRight ? fixedRight.getBoundingClientRect().width : 0,
        bottom: fixedBottom ? fixedBottom.getBoundingClientRect().height : 0
    };
}

export default function useScrollRect(container, fixedLeft, fixedTop, fixedRight, fixedBottom) {
    const [scrollRect, setScrollRect] = useState(emptyRect);

    useEffect(() => {
        if (!container)
        {
            setScrollRect(emptyRect);
            return () => {};
        }

        const updateScrollRect = () => {
            setScrollRect(prevScrollRect => {
                const fixedMargin = getFixedMargin(fixedLeft, fixedTop, fixedRight, fixedBottom);
                const bounds = subtract(getBounds(fixedLeft, fixedTop), fixedMargin);
                const scrollRect = subtract(getScrollRect(container), fixedMargin);
                const requiredScrollRect = clip(bounds, expand(scrollRect, requiredMargin));
                const preloadedScrollRect = clip(bounds, expand(scrollRect, preloadedMargin));

                if (!contains(bounds, prevScrollRect))
                    return preloadedScrollRect;

                if (!contains(prevScrollRect, requiredScrollRect))
                    return preloadedScrollRect;

                if (area(prevScrollRect) > 2 * area(preloadedScrollRect))
                    return preloadedScrollRect;

                return prevScrollRect;
            });
        };

        container.addEventListener('scroll', updateScrollRect);
        const resizeObserver = new ResizeObserver(updateScrollRect);

        resizeObserver.observe(container);
        resizeObserver.observe(fixedLeft);
        resizeObserver.observe(fixedTop);
        resizeObserver.observe(fixedRight);
        resizeObserver.observe(fixedBottom);

        return () => {
            container.removeEventListener('scroll', updateScrollRect);
            resizeObserver.disconnect();
        };
    }, [container, fixedLeft, fixedTop, fixedRight, fixedBottom]);

    return scrollRect;
}