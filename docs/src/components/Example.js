import { useMemo } from "react";
import "./Example.css";

export default function Example({ children, align, maxHeight, maxWidth }) {
    const style = useMemo(() => {
        if (!align)
            return {};

        return {
            justifyContent: align
        };
    }, [align]);

    const innerStyle = useMemo(() => {
        const s = {};
        if (maxHeight) s.maxHeight = maxHeight;
        if (maxWidth) s.maxWidth = maxWidth;
        return s;
    }, [maxHeight, maxWidth]);

    return (
        <div className="Example" style={style}>
            <div className="Example-inner" style={innerStyle}>
                {children}
            </div>
        </div>
    )
}