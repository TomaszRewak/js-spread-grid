import { useMemo } from "react";
import "./Example.css";

export default function Example({ children, align }) {
    const style = useMemo(() => {
        if (!align)
            return {};

        return {
            justifyContent: align
        };
    }, [align]);

    return (
        <div className="Example" style={style}>
            <div className="Example-inner">
                {children}
            </div>
        </div>
    )
}