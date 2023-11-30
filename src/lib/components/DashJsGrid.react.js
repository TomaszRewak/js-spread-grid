/* eslint-disable import/prefer-default-export */
import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import GridCanvas from '../fragments/GridCanvas.react';
import StyleResolver from '../utils/StyleResolver';
import useScrollRect from '../hooks/useScrollRect';
import stringifyKey from '../utils/stringifyKey';

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
    const rows = useResolvedRows(props.rows);
    const valueSelector = useResolvedValueSelector(props.valueSelector);
    const fixedColumns = props.fixedColumns;
    const fixedRows = props.fixedRows;
    const formatting = useResolvedFormatting(props.formatting);

    return {
        data,
        columns,
        rows,
        valueSelector,
        fixedColumns,
        fixedRows,
        formatting
    }
}

// TODO: move somewhere else
function useCells(data, columns, rows, valueSelector, styleResolver) {
    return useMemo(() => {
        return rows.map(row => {
            if (row.type === 'header')
                return columns.map(column => ({ value: column.header, style: { background: 'lightgrey' } }));

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

function DashJsGrid(props) {
    const { data, columns, rows, valueSelector, formatting } = useResolvedProps(props);
    const [container, setContainer] = useState(null);
    const [fixedTop, setFixedTop] = useState(null);
    const [fixedBottom, setFixedBottom] = useState(null);
    const [fixedLeft, setFixedLeft] = useState(null);
    const [fixedRight, setFixedRight] = useState(null);

    // TODO: Move to separate files
    const columnDefinitions = useMemo(() => {
        if (typeof columns === 'function')
            return columns(data);

        return columns;
    }, [columns, data]);

    const rowDefinitions = useMemo(() => {
        if (typeof rows === 'function')
            return rows(data);

        return rows;
    }, [rows, data]);

    const indexedColumnDefinitions = useMemo(() => {
        return columnDefinitions.map((column, index) => ({
            ...column,
            index,
            key: stringifyKey(column.id),
        }));
    }, [columnDefinitions]);

    const indexedRowDefinitions = useMemo(() => {
        return rowDefinitions.map((row, index) => ({
            ...row,
            index,
            key: stringifyKey(row.id),
        }));
    }, [rowDefinitions]);

    const styleResolver = useMemo(() => {
        return new StyleResolver(formatting);
    }, [formatting]);

    const scrollRect = useScrollRect(container, fixedLeft, fixedTop, fixedRight, fixedBottom);

    const leftColumns = useMemo(() => indexedColumnDefinitions.filter(column => column.fixed === 'left'), [indexedColumnDefinitions]);
    const middleColumns = useMemo(() => indexedColumnDefinitions.filter(column => column.fixed !== 'left' && column.fixed !== 'right'), [indexedColumnDefinitions]);
    const rightColumns = useMemo(() => indexedColumnDefinitions.filter(column => column.fixed === 'right'), [indexedColumnDefinitions]);
    const topRows = useMemo(() => indexedRowDefinitions.filter(row => row.fixed === 'top'), [indexedRowDefinitions]);
    const middleRows = useMemo(() => indexedRowDefinitions.filter(row => row.fixed !== 'top' && row.fixed !== 'bottom'), [indexedRowDefinitions]);
    const bottomRows = useMemo(() => indexedRowDefinitions.filter(row => row.fixed === 'bottom'), [indexedRowDefinitions]);

    const topLeftCell = useCells(data, leftColumns, topRows, valueSelector, styleResolver);
    const topMiddleCell = useCells(data, middleColumns, topRows, valueSelector, styleResolver);
    const topRightCell = useCells(data, rightColumns, topRows, valueSelector, styleResolver);
    const middleLeftCell = useCells(data, leftColumns, middleRows, valueSelector, styleResolver);
    const middleMiddleCell = useCells(data, middleColumns, middleRows, valueSelector, styleResolver);
    const middleRightCell = useCells(data, rightColumns, middleRows, valueSelector, styleResolver);
    const bottomLeftCell = useCells(data, leftColumns, bottomRows, valueSelector, styleResolver);
    const bottomMiddleCell = useCells(data, middleColumns, bottomRows, valueSelector, styleResolver);
    const bottomRightCell = useCells(data, rightColumns, bottomRows, valueSelector, styleResolver);

    // TODO: Display left/right/top/bottom borders for all fixed rows and display them for middle cells if no fixed rows/columns are present
    // TODO: Memoize styles
    return (
        <div
            className='dash-js-grid'
            ref={setContainer}
            style={{ maxWidth: 'fit-content', maxHeight: 'fit-content', overflow: 'auto', display: 'grid', gridTemplateColumns: 'auto auto auto', gridTemplateRows: 'auto auto auto' }}
        >
            <div ref={setFixedLeft} style={{ gridRow: '1 / 4', gridColumn: '1' }} />
            <div ref={setFixedRight} style={{ gridRow: '1 / 4', gridColumn: '3' }} />
            <div ref={setFixedTop} style={{ gridRow: '1', gridColumn: '1 / 4' }} />
            <div ref={setFixedBottom} style={{ gridRow: '3', gridColumn: '1 / 4' }} />

            <GridCanvas
                style={{ position: 'sticky', left: 0, top: 0, zIndex: 2, gridRow: '1', gridColumn: '1' }}
                cells={topLeftCell}
                columns={leftColumns}
                rows={topRows}
                showLeftBorder
                showTopBorder
            />
            <GridCanvas
                style={{ position: 'sticky', top: 0, zIndex: 1, gridRow: '1', gridColumn: '2' }}
                cells={topMiddleCell}
                columns={middleColumns}
                rows={topRows}
                showTopBorder
                scrollLeft={scrollRect.left}
                scrollWidth={scrollRect.width}
            />
            <GridCanvas
                style={{ position: 'sticky', right: 0, top: 0, zIndex: 2, gridRow: '1', gridColumn: '3' }}
                cells={topRightCell}
                columns={rightColumns}
                rows={topRows}
                showTopBorder
            />
            <GridCanvas
                style={{ position: 'sticky', left: 0, zIndex: 1, gridRow: '2', gridColumn: '1' }}
                cells={middleLeftCell}
                columns={leftColumns}
                rows={middleRows}
                showLeftBorder
                scrollTop={scrollRect.top}
                scrollHeight={scrollRect.height}
            />
            <GridCanvas
                style={{ gridRow: '2', gridColumn: '2' }}
                cells={middleMiddleCell}
                columns={middleColumns}
                rows={middleRows}
                scrollLeft={scrollRect.left}
                scrollTop={scrollRect.top}
                scrollWidth={scrollRect.width}
                scrollHeight={scrollRect.height}
            />
            <GridCanvas
                style={{ position: 'sticky', right: 0, zIndex: 1, gridRow: '2', gridColumn: '3' }}
                cells={middleRightCell}
                columns={rightColumns}
                rows={middleRows}
                scrollTop={scrollRect.top}
                scrollHeight={scrollRect.height}
            />
            <GridCanvas
                style={{ position: 'sticky', left: 0, bottom: 0, zIndex: 2, gridRow: '3', gridColumn: '1' }}
                cells={bottomLeftCell}
                columns={leftColumns}
                rows={bottomRows}
                showLeftBorder
            />
            <GridCanvas
                style={{ position: 'sticky', bottom: 0, zIndex: 1, gridRow: '3', gridColumn: '2' }}
                cells={bottomMiddleCell}
                columns={middleColumns}
                rows={bottomRows}
                scrollLeft={scrollRect.left}
                scrollWidth={scrollRect.width}
            />
            <GridCanvas
                style={{ position: 'sticky', right: 0, bottom: 0, zIndex: 2, gridRow: '3', gridColumn: '3' }}
                cells={bottomRightCell}
                columns={rightColumns}
                rows={bottomRows}
            />
        </div>
    );
};

// TODO: add descriptions
// TODO: fixing rows to top and bottom
DashJsGrid.propTypes = {
    //
    data: PropTypes.array,
    //
    columns: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    //
    rows: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
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
    rows: '[{type: "header", height: 20, fixed: "top"}, ...data.map((_, index) => ({id: index, height: 20}))]',
    valueSelector: 'data[rowId][columnId]',
    formatting: [{ column: { match: 'HEADER' }, style: '{background: "lightgrey"}' }]
};

export default DashJsGrid;
