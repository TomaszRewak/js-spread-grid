/* eslint-disable import/prefer-default-export */
import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import GridCanvas from '../fragments/GridCanvas.react';
import StyleResolver from '../utils/StyleResolver';
import useScrollRect from '../hooks/useScrollRect';
import stringifyId from '../utils/stringifyId';
import GridInteractions from '../fragments/GridInteractions.react';
import useDevicePixelRatio from '../hooks/useDevicePixelRatio';

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
    const setProps = props.setProps;
    const data = props.data;
    const columns = useResolvedColumns(props.columns);
    const columnsLeft = useResolvedColumns(props.columnsLeft);
    const columnsRight = useResolvedColumns(props.columnsRight);
    const rows = useResolvedRows(props.rows);
    const rowsTop = useResolvedRows(props.rowsTop);
    const rowsBottom = useResolvedRows(props.rowsBottom);
    const valueSelector = useResolvedValueSelector(props.valueSelector);
    const formatting = useResolvedFormatting(props.formatting);
    const hoverCell = props.hoverCell;
    const selectedCells = props.selectedCells;

    return {
        setProps,
        data,
        columns,
        columnsLeft,
        columnsRight,
        rows,
        rowsTop,
        rowsBottom,
        valueSelector,
        formatting,
        hoverCell,
        selectedCells
    }
}

// TODO: move somewhere else
// TODO: resolve the full style only for the cells in view
function useCells(data, columns, rows, valueSelector, styleResolver, hoverCell, selectedCellsLookup) {
    return useMemo(() => {
        // TODO: This can be moved outside this memo block, into its own
        const hoveredColumnKey = hoverCell ? stringifyId(hoverCell.columnId) : null;
        const hoveredRowKey = hoverCell ? stringifyId(hoverCell.rowId) : null;

        const isSelected = (rowIndex, columnIndex) => {
            if (rowIndex < 0 || rowIndex >= rows.length)
                return false;
            if (columnIndex < 0 || columnIndex >= columns.length)
                return false;

            const rowKey = rows[rowIndex].key;
            const columnKey = columns[columnIndex].key;

            return selectedCellsLookup.has(rowKey) && selectedCellsLookup.get(rowKey).has(columnKey);
        };

        return rows.map(row => {
            // TODO: Don't treat the header separately
            if (row.type === 'header')
                return columns.map(column => ({ value: column.header, style: { background: '#F5F5F5' } }));

            return columns.map(column => {
                const value = valueSelector(data, row.id, column.id);
                const style = styleResolver.resolve(column.key, column.index, row.key, row.index, value);

                // TODO: Don't modify the original object
                if (hoveredColumnKey === column.key && hoveredRowKey === row.key)
                    style.highlight = '#81948188';
                else if (hoveredColumnKey === column.key || hoveredRowKey === row.key)
                    style.highlight = '#81948133';

                if (isSelected(row.index, column.index))
                {
                    style.highlight = '#819481aa';

                    if (!isSelected(row.index - 1, column.index))
                        style.borderTop = { width: 5, color: '#819481ff', index: Number.MAX_SAFE_INTEGER };
                    if (!isSelected(row.index + 1, column.index))
                        style.borderBottom = { width: 5, color: '#819481ff', index: Number.MAX_SAFE_INTEGER };
                    if (!isSelected(row.index, column.index - 1))
                        style.borderLeft = { width: 5, color: '#819481ff', index: Number.MAX_SAFE_INTEGER };
                    if (!isSelected(row.index, column.index + 1))
                        style.borderRight = { width: 5, color: '#819481ff', index: Number.MAX_SAFE_INTEGER };
                }

                return {
                    value,
                    style
                };
            });
        });
    }, [data, columns, rows, valueSelector, styleResolver, hoverCell, selectedCellsLookup]);
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

function roundToPixels(value, devicePixelRatio) {
    return Math.round(value * devicePixelRatio) / devicePixelRatio;
}

function useDefinitionWithRoundedWidth(columnDefinitions, devicePixelRatio) {
    return useMemo(() => {
        return columnDefinitions.map(definition => ({
            ...definition,
            width: roundToPixels(definition.width, devicePixelRatio)
        }));
    }, [columnDefinitions, devicePixelRatio]);
}

function useDefinitionWithRoundedHeight(rowDefinitions, devicePixelRatio) {
    return useMemo(() => {
        return rowDefinitions.map(definition => ({
            ...definition,
            height: roundToPixels(definition.height, devicePixelRatio)
        }));
    }, [rowDefinitions, devicePixelRatio]);
}

function useSelectedCellsLookup(selectedCells) {
    return useMemo(() => {
        const lookup = new Map();

        selectedCells.forEach(cell => {
            const rowKey = stringifyId(cell.rowId);
            const columnKey = stringifyId(cell.columnId);

            if (!lookup.has(rowKey))
                lookup.set(rowKey, new Set());

            lookup.get(rowKey).add(columnKey);
        });

        return lookup;
    }, [selectedCells]);
}

// TODO: Write description
function DashJsGrid(props) {
    // TODO: Use intersection observer to only render the grid if it is in view
    // TODO: Selected columns (selected rows): [{columnId: 'col1', headerId: 'default'}]
    // TODO: Selected cells: [{rowId: 'row1', columnId: 'col1'}]
    // TODO: Sorting: [{columnId: 'col1', headerId: 'default' , direction: 'ASC'}]
    // TODO: Use headers (as well as fixed area boundaries) as separators and sort data only in between them

    const { setProps, data, columns, columnsLeft, columnsRight, rows, rowsTop, rowsBottom, valueSelector, formatting, hoverCell, selectedCells } = useResolvedProps(props);
    const [container, setContainer] = useState(null);
    const [fixedTop, setFixedTop] = useState(null);
    const [fixedBottom, setFixedBottom] = useState(null);
    const [fixedLeft, setFixedLeft] = useState(null);
    const [fixedRight, setFixedRight] = useState(null);

    const devicePixelRatio = useDevicePixelRatio();
    const borderWidth = 1 / devicePixelRatio;
    const selectedCellsLookup = useSelectedCellsLookup(selectedCells);

    const leftColumns = useDefinitionWithRoundedWidth(useIndexedDefinitions(useInvoked(columnsLeft, [data])), devicePixelRatio);
    const middleColumns = useDefinitionWithRoundedWidth(useIndexedDefinitions(useInvoked(columns, [data])), devicePixelRatio);
    const rightColumns = useDefinitionWithRoundedWidth(useIndexedDefinitions(useInvoked(columnsRight, [data])), devicePixelRatio);
    const topRows = useDefinitionWithRoundedHeight(useIndexedDefinitions(useInvoked(rowsTop, [data])), devicePixelRatio);
    const middleRows = useDefinitionWithRoundedHeight(useIndexedDefinitions(useInvoked(rows, [data])), devicePixelRatio);
    const bottomRows = useDefinitionWithRoundedHeight(useIndexedDefinitions(useInvoked(rowsBottom, [data])), devicePixelRatio);

    const styleResolver = useMemo(() => {
        return new StyleResolver(formatting);
    }, [formatting]);

    const scrollRect = useScrollRect(container, fixedLeft, fixedTop, fixedRight, fixedBottom);

    const topLeftCell = useCells(data, leftColumns, topRows, valueSelector, styleResolver, hoverCell, selectedCellsLookup);
    const topMiddleCell = useCells(data, middleColumns, topRows, valueSelector, styleResolver, hoverCell, selectedCellsLookup);
    const topRightCell = useCells(data, rightColumns, topRows, valueSelector, styleResolver, hoverCell, selectedCellsLookup);
    const middleLeftCell = useCells(data, leftColumns, middleRows, valueSelector, styleResolver, hoverCell, selectedCellsLookup);
    const middleMiddleCell = useCells(data, middleColumns, middleRows, valueSelector, styleResolver, hoverCell, selectedCellsLookup);
    const middleRightCell = useCells(data, rightColumns, middleRows, valueSelector, styleResolver, hoverCell, selectedCellsLookup);
    const bottomLeftCell = useCells(data, leftColumns, bottomRows, valueSelector, styleResolver, hoverCell, selectedCellsLookup);
    const bottomMiddleCell = useCells(data, middleColumns, bottomRows, valueSelector, styleResolver, hoverCell, selectedCellsLookup);
    const bottomRightCell = useCells(data, rightColumns, bottomRows, valueSelector, styleResolver, hoverCell, selectedCellsLookup);

    // TODO: Display left/right/top/bottom borders for all fixed rows and display them for middle cells if no fixed rows/columns are present
    // TODO: Memoize styles
    // TODO: Remove hardcoded width/height
    return (
        <div
            className='dash-js-grid'
            ref={setContainer}
            style={{ height: '50vh', width: '60vw', maxWidth: 'fit-content', maxHeight: 'fit-content', overflow: 'auto', display: 'grid', position: 'relative', gridTemplateColumns: 'auto auto auto', gridTemplateRows: 'auto auto auto' }}
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
                borderWidth={borderWidth}
                devicePixelRatio={devicePixelRatio}
            />
            <GridCanvas
                style={{ position: 'sticky', top: 0, zIndex: 1, gridRow: '1', gridColumn: '2' }}
                cells={topMiddleCell}
                columns={middleColumns}
                rows={topRows}
                showTopBorder
                scrollLeft={scrollRect.left}
                scrollWidth={scrollRect.width}
                borderWidth={borderWidth}
                devicePixelRatio={devicePixelRatio}
            />
            <GridCanvas
                style={{ position: 'sticky', right: 0, top: 0, zIndex: 2, gridRow: '1', gridColumn: '3' }}
                cells={topRightCell}
                columns={rightColumns}
                rows={topRows}
                showTopBorder
                borderWidth={borderWidth}
                devicePixelRatio={devicePixelRatio}
            />
            <GridCanvas
                style={{ position: 'sticky', left: 0, zIndex: 1, gridRow: '2', gridColumn: '1' }}
                cells={middleLeftCell}
                columns={leftColumns}
                rows={middleRows}
                showLeftBorder
                scrollTop={scrollRect.top}
                scrollHeight={scrollRect.height}
                borderWidth={borderWidth}
                devicePixelRatio={devicePixelRatio}
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
                borderWidth={borderWidth}
                devicePixelRatio={devicePixelRatio}
            />
            <GridCanvas
                style={{ position: 'sticky', right: 0, zIndex: 1, gridRow: '2', gridColumn: '3' }}
                cells={middleRightCell}
                columns={rightColumns}
                rows={middleRows}
                scrollTop={scrollRect.top}
                scrollHeight={scrollRect.height}
                borderWidth={borderWidth}
                devicePixelRatio={devicePixelRatio}
            />
            <GridCanvas
                style={{ position: 'sticky', left: 0, bottom: 0, zIndex: 2, gridRow: '3', gridColumn: '1' }}
                cells={bottomLeftCell}
                columns={leftColumns}
                rows={bottomRows}
                showLeftBorder
                borderWidth={borderWidth}
                devicePixelRatio={devicePixelRatio}
            />
            <GridCanvas
                style={{ position: 'sticky', bottom: 0, zIndex: 1, gridRow: '3', gridColumn: '2' }}
                cells={bottomMiddleCell}
                columns={middleColumns}
                rows={bottomRows}
                scrollLeft={scrollRect.left}
                scrollWidth={scrollRect.width}
                borderWidth={borderWidth}
                devicePixelRatio={devicePixelRatio}
            />
            <GridCanvas
                style={{ position: 'sticky', right: 0, bottom: 0, zIndex: 2, gridRow: '3', gridColumn: '3' }}
                cells={bottomRightCell}
                columns={rightColumns}
                rows={bottomRows}
                borderWidth={borderWidth}
                devicePixelRatio={devicePixelRatio}
            />

            <GridInteractions
                container={container}
                leftColumns={leftColumns}
                middleColumns={middleColumns}
                rightColumns={rightColumns}
                topRows={topRows}
                middleRows={middleRows}
                bottomRows={bottomRows}
                borderWidth={borderWidth}
                hoverCell={hoverCell}
                selectedCells={selectedCells}
                selectedCellsLookup={selectedCellsLookup}
                setProps={setProps}
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
    ),
    //
    hoverCell: PropTypes.shape({
        rowId: PropTypes.any,
        columnId: PropTypes.any
    }),
    //
    selectedCells: PropTypes.arrayOf(
        PropTypes.shape({
            rowId: PropTypes.any,
            columnId: PropTypes.any
        })
    ),
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
    formatting: [{ column: { match: 'HEADER' }, style: '{background: "lightgrey"}' }],
    hoverCell: null,
    selectedCells: []
};

export default DashJsGrid;
