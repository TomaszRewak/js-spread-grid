import React, { useState } from "react";
import createGrid from "js-spread-grid";

export default function SpreadGrid(props) {
    const [element, setElement] = useState(null);

    if (element) {
        createGrid(element, props);
    }

    return React.createElement("div", { ref: setElement });
}