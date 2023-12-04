/* eslint-disable import/prefer-default-export */
import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import GridCanvas from '../fragments/GridCanvas.react';
import StyleResolver from '../utils/StyleResolver';
import useScrollRect from '../hooks/useScrollRect';
import stringifyId from '../utils/stringifyId';
import { useInteractions } from '../hooks/useInteractions';

function useResolvedValueSelector(valueSelector) {
    return useMemo(() => {
        return eval(`(data, rowId, columnId) => (${valueSelector})`);
    }, [valueSelector])
}

function useResolvedColumns(columns) {
    return useMemo(() => {
        if (typeof columns !== 'string')
            return columns;

        return eval(`(data) => (${columns})`);
    }, [columns]);
}

function useResolvedRows(rows) {
    return useMemo(() => {
        if (typeof rows !== 'string')
            return rows;

        return eval(`(data) => (${rows})`);
    }, [rows]);
}

function useResolvedFormatting(formatting) {
    return useMemo(() => {
        return formatting.map(style => ({
            column: style.column,
            row: style.row,
            condition: eval(`(value) => (${style.condition || 'true'})`),
            style: eval(`(value) => (${style.style})`)
        }));
    }, [formatting]);
}

function useResolvedProps(props) {
    const data = props.data;
    const columns = useResolvedColumns(props.columns);
    const columnsLeft = useResolvedColumns(props.columnsLeft);
    const columnsRight = useResolvedColumns(props.columnsRight);
    const rows = useResolvedRows(props.rows);
    const rowsTop = useResolvedRows(props.rowsTop);
    const rowsBottom = useResolvedRows(props.rowsBottom);
    const valueSelector = useResolvedValueSelector(props.valueSelector);
    const formatting = useResolvedFormatting(props.formatting);

    return {
        data,
        columns,
        columnsLeft,
        columnsRight,
        rows,
        rowsTop,
        rowsBottom,
        valueSelector,
        formatting
    }
}

// TODO: move somewhere else
// TODO: resolve the full style only for the cells in view
function useCells(data, columns, rows, valueSelector, styleResolver) {
    return useMemo(() => {
        return rows.map(row => {
            // TODO: Don't treat the header separately
            if (row.type === 'header')
                return columns.map(column => ({ value: column.header, style: { background: '#F5F5F5' } }));

            return columns.map(column => {
                const value = valueSelector(data, row.id, column.id);
                const style = styleResolver.resolve(column.key, column.index, row.key, row.index, value);

                return {
                    value,
                    style
                };
            });
        });
    }, [data, columns, rows, valueSelector, styleResolver]);
}

// TODO: Move elsewhere
function useInvoked(expression, args) {
    return useMemo(() => {
        if (typeof expression === 'function')
            return expression(...args);

        return expression;
    }, [expression, ...args]);
}

function useIndexedDefinitions(definitions) {
    return useMemo(() => {
        return definitions.map((definition, index) => ({
            ...definition,
            index,
            key: stringifyId(definition.id),
        }));
    }, [definitions]);
}

// TODO: Write description
function DashJsGrid(props) {
    // TODO: Use intersection observer to only render the grid if it is in view
    // TODO: Selected columns (selected rows): [{columnId: 'col1', headerId: 'default'}]
    // TODO: Selected cells: [{rowId: 'row1', columnId: 'col1'}]
    // TODO: Sorting: [{columnId: 'col1', headerId: 'default' , direction: 'ASC'}]
    // TODO: Use headers (as well as fixed area boundaries) as separators and sort data only in between them

    const { data, columns, columnsLeft, columnsRight, rows, rowsTop, rowsBottom, valueSelector, formatting } = useResolvedProps(props);
    const [container, setContainer] = useState(null);
    const [fixedTop, setFixedTop] = useState(null);
    const [fixedBottom, setFixedBottom] = useState(null);
    const [fixedLeft, setFixedLeft] = useState(null);
    const [fixedRight, setFixedRight] = useState(null);

    useInteractions(container);

    const leftColumnDefinitions = useIndexedDefinitions(useInvoked(columnsLeft, [data]));
    const middleColumnDefinitions = useIndexedDefinitions(useInvoked(columns, [data]));
    const rightColumnDefinitions = useIndexedDefinitions(useInvoked(columnsRight, [data]));
    const topRowDefinitions = useIndexedDefinitions(useInvoked(rowsTop, [data]));
    const middleRowDefinitions = useIndexedDefinitions(useInvoked(rows, [data]));
    const bottomRowDefinitions = useIndexedDefinitions(useInvoked(rowsBottom, [data]));

    const styleResolver = useMemo(() => {
        return new StyleResolver(formatting);
    }, [formatting]);

    const scrollRect = useScrollRect(container, fixedLeft, fixedTop, fixedRight, fixedBottom);

    const topLeftCell = useCells(data, leftColumnDefinitions, topRowDefinitions, valueSelector, styleResolver);
    const topMiddleCell = useCells(data, middleColumnDefinitions, topRowDefinitions, valueSelector, styleResolver);
    const topRightCell = useCells(data, rightColumnDefinitions, topRowDefinitions, valueSelector, styleResolver);
    const middleLeftCell = useCells(data, leftColumnDefinitions, middleRowDefinitions, valueSelector, styleResolver);
    const middleMiddleCell = useCells(data, middleColumnDefinitions, middleRowDefinitions, valueSelector, styleResolver);
    const middleRightCell = useCells(data, rightColumnDefinitions, middleRowDefinitions, valueSelector, styleResolver);
    const bottomLeftCell = useCells(data, leftColumnDefinitions, bottomRowDefinitions, valueSelector, styleResolver);
    const bottomMiddleCell = useCells(data, middleColumnDefinitions, bottomRowDefinitions, valueSelector, styleResolver);
    const bottomRightCell = useCells(data, rightColumnDefinitions, bottomRowDefinitions, valueSelector, styleResolver);

    // TODO: Display left/right/top/bottom borders for all fixed rows and display them for middle cells if no fixed rows/columns are present
    // TODO: Memoize styles
    // TODO: Remove hardcoded width/height
    return (
        <div
            className='dash-js-grid'
            ref={setContainer}
            style={{ height: '50vh', width: '60vw', maxWidth: 'fit-content', maxHeight: 'fit-content', overflow: 'auto', display: 'grid', gridTemplateColumns: 'auto auto auto', gridTemplateRows: 'auto auto auto' }}
        >
            <div ref={setFixedLeft} style={{ gridRow: '1 / 4', gridColumn: '1' }} />
            <div ref={setFixedRight} style={{ gridRow: '1 / 4', gridColumn: '3' }} />
            <div ref={setFixedTop} style={{ gridRow: '1', gridColumn: '1 / 4' }} />
            <div ref={setFixedBottom} style={{ gridRow: '3', gridColumn: '1 / 4' }} />

            <GridCanvas
                style={{ position: 'sticky', left: 0, top: 0, zIndex: 2, gridRow: '1', gridColumn: '1' }}
                cells={topLeftCell}
                columns={leftColumnDefinitions}
                rows={topRowDefinitions}
                showLeftBorder
                showTopBorder
            />
            <GridCanvas
                style={{ position: 'sticky', top: 0, zIndex: 1, gridRow: '1', gridColumn: '2' }}
                cells={topMiddleCell}
                columns={middleColumnDefinitions}
                rows={topRowDefinitions}
                showTopBorder
                scrollLeft={scrollRect.left}
                scrollWidth={scrollRect.width}
            />
            <GridCanvas
                style={{ position: 'sticky', right: 0, top: 0, zIndex: 2, gridRow: '1', gridColumn: '3' }}
                cells={topRightCell}
                columns={rightColumnDefinitions}
                rows={topRowDefinitions}
                showTopBorder
            />
            <GridCanvas
                style={{ position: 'sticky', left: 0, zIndex: 1, gridRow: '2', gridColumn: '1' }}
                cells={middleLeftCell}
                columns={leftColumnDefinitions}
                rows={middleRowDefinitions}
                showLeftBorder
                scrollTop={scrollRect.top}
                scrollHeight={scrollRect.height}
            />
            <GridCanvas
                style={{ gridRow: '2', gridColumn: '2' }}
                cells={middleMiddleCell}
                columns={middleColumnDefinitions}
                rows={middleRowDefinitions}
                scrollLeft={scrollRect.left}
                scrollTop={scrollRect.top}
                scrollWidth={scrollRect.width}
                scrollHeight={scrollRect.height}
            />
            <GridCanvas
                style={{ position: 'sticky', right: 0, zIndex: 1, gridRow: '2', gridColumn: '3' }}
                cells={middleRightCell}
                columns={rightColumnDefinitions}
                rows={middleRowDefinitions}
                scrollTop={scrollRect.top}
                scrollHeight={scrollRect.height}
            />
            <GridCanvas
                style={{ position: 'sticky', left: 0, bottom: 0, zIndex: 2, gridRow: '3', gridColumn: '1' }}
                cells={bottomLeftCell}
                columns={leftColumnDefinitions}
                rows={bottomRowDefinitions}
                showLeftBorder
            />
            <GridCanvas
                style={{ position: 'sticky', bottom: 0, zIndex: 1, gridRow: '3', gridColumn: '2' }}
                cells={bottomMiddleCell}
                columns={middleColumnDefinitions}
                rows={bottomRowDefinitions}
                scrollLeft={scrollRect.left}
                scrollWidth={scrollRect.width}
            />
            <GridCanvas
                style={{ position: 'sticky', right: 0, bottom: 0, zIndex: 2, gridRow: '3', gridColumn: '3' }}
                cells={bottomRightCell}
                columns={rightColumnDefinitions}
                rows={bottomRowDefinitions}
            />
        </div>
    );
};

// TODO: add descriptions
// TODO: Fix types
DashJsGrid.propTypes = {
    //
    data: PropTypes.array,
    //
    columns: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    //
    columnsLeft: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    //
    columnsRight: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    //
    rows: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    //
    rowsTop: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    //
    rowsBottom: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    //
    valueSelector: PropTypes.string,
    //
    formatting: PropTypes.arrayOf(
        PropTypes.shape({
            column: PropTypes.oneOfType([
                PropTypes.shape({ match: PropTypes.oneOf(['ANY', 'LEFT', 'RIGHT', 'HEADER']) }),
                PropTypes.shape({ id: PropTypes.any }),
                PropTypes.shape({ index: PropTypes.number }),
            ]),
            row: PropTypes.oneOfType([
                PropTypes.shape({ match: PropTypes.oneOf(['ANY', 'TOP', 'BOTTOM', 'HEADER']) }),
                PropTypes.shape({ id: PropTypes.any }),
                PropTypes.shape({ index: PropTypes.number }),
            ]),
            condition: PropTypes.string,
            // TODO: Make this also accept style objects
            style: PropTypes.string
        })
    )
};

DashJsGrid.defaultProps = {
    data: [],
    columns: 'data.length > 0 ? Object.keys(data[0]).map((key) => ({id: key, header: key, width: 100})) : []',
    columnsLeft: [],
    columnsRight: [],
    rows: 'data.map((_, index) => ({id: index, height: 20}))',
    rowsTop: [{ type: 'header', height: 20 }],
    rowsBottom: [],
    valueSelector: 'data[rowId][columnId]',
    formatting: [{ column: { match: 'HEADER' }, style: '{background: "lightgrey"}' }]
};

export default DashJsGrid;
