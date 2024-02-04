import React, { useState } from "react";
import createGrid from "../core/grid";

export default function SpreadGrid(props) {
    const [element, setElement] = useState(null);

    if (element)
        createGrid(element, props);

    return <div ref={setElement} />;
}