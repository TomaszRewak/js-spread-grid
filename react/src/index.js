/** @import {ExternalOptions} from "js-spread-grid" */

import React, { useState } from "react";
import createGrid from "js-spread-grid";

/**
 * @param {ExternalOptions} props
 */
export default function SpreadGrid(props) {
    const [element, setElement] = useState(null);

    if (element) {
        createGrid(element, props);
    }

    return React.createElement("div", { ref: setElement });
}