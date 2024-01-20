/* eslint-disable import/prefer-default-export */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import SpreadGrid from './../lib/components/SpreadGrid';

function isString(value) {
    return typeof value === 'string' || value instanceof String;
}

function useResolvedFormatting(formatting) {
    return useMemo(() => {
        return formatting.map(rule => {
            const mappedRule = {};

            if ('column' in rule)
                mappedRule.column = rule.column;
            if ('row' in rule)
                mappedRule.row = rule.row;
            if ('condition' in rule)
                mappedRule.condition = eval(`({data, rows, columns, row, column, value, newValue, text}) => (${rule.condition})`);
            if ('style' in rule)
                mappedRule.style = isString(rule.style) ? eval(`({data, rows, columns, row, column, value, newValue, text}) => (${rule.style})`) : rule.style;
            if ('value' in rule)
                mappedRule.value = eval(`({data, rows, columns, row, column, value, newValue, text})=> (${rule.value})`);
            if ('text' in rule)
                mappedRule.text = eval(`({data, rows, columns, row, column, value, newValue, text}) => (${rule.text})`);

            return mappedRule;
        });
    }, [formatting]);
}

// TODO: Write description
// TODO: Rename to DashSpreadGrid
function DashSpreadGrid(props) {
    console.count('render DashSpreadGrid');

    const data = props.data;
    const columns = props.columns;
    const rows = props.rows;
    const formatting = useResolvedFormatting(props.formatting);
    const pinnedTop = props.pinnedTop;
    const pinnedBottom = props.pinnedBottom;
    const pinnedLeft = props.pinnedLeft;
    const pinnedRight = props.pinnedRight;

    // eslint-disable-next-line react/prop-types
    // const setProps = props.setProps;

    // const setSelectedCells = useCallback(selectedCells => setProps({ selectedCells }), [setProps]);
    // const setHoveredCell = useCallback(hoveredCell => setProps({ hoveredCell }), [setProps]);
    // const setFocusedCell = useCallback(focusedCell => setProps({ focusedCell }), [setProps]);

    return (
        <SpreadGrid
            data={data}
            columns={columns}
            rows={rows}
            formatting={formatting}
            pinnedTop={pinnedTop}
            pinnedBottom={pinnedBottom}
            pinnedLeft={pinnedLeft}
            pinnedRight={pinnedRight}
        />
    );
};

// TODO: add descriptions
// TODO: Fix types
DashSpreadGrid.propTypes = {
    // _
    id: PropTypes.string,
    // _
    data: PropTypes.array,
    // _
    columns: PropTypes.array,
    // _
    rows: PropTypes.array,
    // _
    formatting: PropTypes.array,
    // _
    pinnedTop: PropTypes.number,
    // _
    pinnedBottom: PropTypes.number,
    // _
    pinnedLeft: PropTypes.number,
    // _
    pinnedRight: PropTypes.number,
};

DashSpreadGrid.defaultProps = {
    data: [],
    columns: [],
    rows: [],
    formatting: [],
    pinnedTop: 0,
    pinnedBottom: 0,
    pinnedLeft: 0,
    pinnedRight: 0,
};

export default DashSpreadGrid;
