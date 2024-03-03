import React, { useState } from "react";
import createGrid from "../../lib/dist/main";

export default function SpreadGrid(props) {
    const [element, setElement] = useState(null);

    if (element) {
        createGrid(element, props);
    }

    return React.createElement("div", { ref: setElement });
}