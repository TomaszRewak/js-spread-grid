/* eslint-disable import/prefer-default-export */
import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import GridCanvas from '../fragments/GridCanvas.react';
import FormatResolver from '../utils/FormatResolver';
import useScrollRect from '../hooks/useScrollRect';
import stringifyId from '../utils/stringifyId';
import GridInteractions from '../fragments/GridInteractions.react';
import useDevicePixelRatio from '../hooks/useDevicePixelRatio';
import Conditional from '../fragments/Conditional.react';

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
        return formatting.map(rule => ({
            column: rule.column || { match: 'DATA' },
            row: rule.row || { match: 'DATA' },
            condition: rule.condition ? eval(`(data, rows, columns, row, column, value) => (${rule.condition})`) : null,
            style: rule.style ? eval(`(data, rows, columns, row, column, value) => (${rule.style})`) : null,
            value: rule.value ? eval(`(data, rows, columns, row, column, value) => (${rule.value})`) : null
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
    const defaultFormatting = useResolvedFormatting(props.defaultFormatting);
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
        defaultFormatting,
        formatting,
        hoverCell,
        selectedCells
    }
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
    // TODO: Allow rows/columns to have parentId (or groupId?) to group them together and filter/sort them as a group

    const { setProps, data, columns, columnsLeft, columnsRight, rows, rowsTop, rowsBottom, defaultFormatting, formatting, hoverCell, selectedCells } = useResolvedProps(props);
    const [container, setContainer] = useState(null);
    const [fixedTop, setFixedTop] = useState(null);
    const [fixedBottom, setFixedBottom] = useState(null);
    const [fixedLeft, setFixedLeft] = useState(null);
    const [fixedRight, setFixedRight] = useState(null);

    // TODO: Borders still seem to be blurry for large number of rows/columns
    const devicePixelRatio = useDevicePixelRatio();
    const borderWidth = 1 / devicePixelRatio;
    const selectedCellsLookup = useSelectedCellsLookup(selectedCells);

    const leftColumns = useDefinitionWithRoundedWidth(useIndexedDefinitions(useInvoked(columnsLeft, [data])), devicePixelRatio);
    const middleColumns = useDefinitionWithRoundedWidth(useIndexedDefinitions(useInvoked(columns, [data])), devicePixelRatio);
    const rightColumns = useDefinitionWithRoundedWidth(useIndexedDefinitions(useInvoked(columnsRight, [data])), devicePixelRatio);
    const topRows = useDefinitionWithRoundedHeight(useIndexedDefinitions(useInvoked(rowsTop, [data])), devicePixelRatio);
    const middleRows = useDefinitionWithRoundedHeight(useIndexedDefinitions(useInvoked(rows, [data])), devicePixelRatio);
    const bottomRows = useDefinitionWithRoundedHeight(useIndexedDefinitions(useInvoked(rowsBottom, [data])), devicePixelRatio);

    const formatResolver = useMemo(() => {
        const hoveredColumnKey = hoverCell ? stringifyId(hoverCell.columnId) : null;
        const hoveredRowKey = hoverCell ? stringifyId(hoverCell.rowId) : null;

        const isSelected = (rows, columns, rowIndex, columnIndex) => {
            if (rowIndex < 0 || rowIndex >= rows.length)
                return false;
            if (columnIndex < 0 || columnIndex >= columns.length)
                return false;

            const rowKey = rows[rowIndex].key;
            const columnKey = columns[columnIndex].key;

            return selectedCellsLookup.has(rowKey) && selectedCellsLookup.get(rowKey).has(columnKey);
        };

        const allRules = [
            ...defaultFormatting,
            ...formatting,
            {
                column: { match: 'ANY' },
                row: { match: 'ANY' },
                condition: (data, rows, columns, row, column, value) => hoveredColumnKey === column.key || hoveredRowKey === row.key,
                style: () => ({ highlight: "#81948133" }),
            },
            {
                column: { match: 'ANY' },
                row: { match: 'ANY' },
                condition: (data, rows, columns, row, column, value) => hoveredColumnKey === column.key && hoveredRowKey === row.key,
                style: () => ({ highlight: "#81948188" }),
            },
            {
                column: { match: 'ANY' },
                row: { match: 'ANY' },
                condition: (data, rows, columns, row, column, value) => isSelected(rows, columns, row.index, column.index),
                style: (data, rows, columns, row, column, value) => ({
                    ...(!isSelected(rows, columns, row.index - 1, column.index) ? { borderTop: { width: 5, color: '#596959', index: Number.MAX_SAFE_INTEGER } } : {}),
                    ...(!isSelected(rows, columns, row.index + 1, column.index) ? { borderBottom: { width: 5, color: '#596959', index: Number.MAX_SAFE_INTEGER } } : {}),
                    ...(!isSelected(rows, columns, row.index, column.index - 1) ? { borderLeft: { width: 5, color: '#596959', index: Number.MAX_SAFE_INTEGER } } : {}),
                    ...(!isSelected(rows, columns, row.index, column.index + 1) ? { borderRight: { width: 5, color: '#596959', index: Number.MAX_SAFE_INTEGER } } : {}),
                    highlight: "#81948199"
                }),
            }
        ];

        return new FormatResolver(allRules);
    }, [defaultFormatting, formatting, hoverCell, selectedCellsLookup]);

    const scrollRect = useScrollRect(container, fixedLeft, fixedTop, fixedRight, fixedBottom);

    // TODO: Make sure those formatters are split based on the rule areas
    const topLeftFormatResolver = formatResolver;
    const topMiddleFormatResolver = formatResolver;
    const topRightFormatResolver = formatResolver;
    const middleLeftFormatResolver = formatResolver;
    const middleMiddleFormatResolver = formatResolver;
    const middleRightFormatResolver = formatResolver;
    const bottomLeftFormatResolver = formatResolver;
    const bottomMiddleFormatResolver = formatResolver;
    const bottomRightFormatResolver = formatResolver;

    const hasLeftColumns = leftColumns.length > 0;
    const hasMiddleColumns = middleColumns.length > 0;
    const hasRightColumns = rightColumns.length > 0;
    const hasTopRows = topRows.length > 0;
    const hasMiddleRows = middleRows.length > 0;
    const hasBottomRows = bottomRows.length > 0;

    // TODO: Display left/right/top/bottom borders for all fixed rows and display them for middle cells if no fixed rows/columns are present
    // TODO: Memoize styles
    // TODO: Remove hardcoded width/height
    // TODO: Wrap the grid in another grid and set that grid's max width/height to the 100 vw/vh
    return (
        <div
            className='dash-js-grid'
            ref={setContainer}
            style={{ maxWidth: 'fit-content', maxHeight: 'fit-content', overflow: 'auto', display: 'grid', position: 'relative', gridTemplateColumns: 'auto auto auto', gridTemplateRows: 'auto auto auto' }}
        >
            <div ref={setFixedLeft} style={{ gridRow: '1 / 4', gridColumn: '1' }} />
            <div ref={setFixedRight} style={{ gridRow: '1 / 4', gridColumn: '3' }} />
            <div ref={setFixedTop} style={{ gridRow: '1', gridColumn: '1 / 4' }} />
            <div ref={setFixedBottom} style={{ gridRow: '3', gridColumn: '1 / 4' }} />

            <Conditional condition={hasLeftColumns && hasTopRows}>
                <GridCanvas
                    style={{ position: 'sticky', left: 0, top: 0, zIndex: 2, gridRow: '1', gridColumn: '1' }}
                    data={data}
                    columns={leftColumns}
                    rows={topRows}
                    formatResolver={topLeftFormatResolver}
                    showLeftBorder={true}
                    showTopBorder={true}
                    showRightBorder={true}
                    showBottomBorder={true}
                    borderWidth={borderWidth}
                    devicePixelRatio={devicePixelRatio}
                />
            </Conditional>

            <Conditional condition={hasMiddleColumns && hasTopRows}>
                <GridCanvas
                    style={{ position: 'sticky', top: 0, zIndex: 1, gridRow: '1', gridColumn: '2' }}
                    data={data}
                    columns={middleColumns}
                    rows={topRows}
                    formatResolver={topMiddleFormatResolver}
                    showLeftBorder={!hasLeftColumns}
                    showTopBorder={true}
                    showRightBorder={!hasRightColumns}
                    showBottomBorder={true}
                    scrollLeft={scrollRect.left}
                    scrollWidth={scrollRect.width}
                    borderWidth={borderWidth}
                    devicePixelRatio={devicePixelRatio}
                />
            </Conditional>

            <Conditional condition={hasRightColumns && hasTopRows}>
                <GridCanvas
                    style={{ position: 'sticky', right: 0, top: 0, zIndex: 2, gridRow: '1', gridColumn: '3' }}
                    data={data}
                    columns={rightColumns}
                    rows={topRows}
                    formatResolver={topRightFormatResolver}
                    showLeftBorder={hasMiddleColumns || !hasLeftColumns}
                    showTopBorder={true}
                    showRightBorder={true}
                    showBottomBorder={true}
                    borderWidth={borderWidth}
                    devicePixelRatio={devicePixelRatio}
                />
            </Conditional>

            <Conditional condition={hasLeftColumns && hasMiddleRows}>
                <GridCanvas
                    style={{ position: 'sticky', left: 0, zIndex: 1, gridRow: '2', gridColumn: '1' }}
                    data={data}
                    columns={leftColumns}
                    rows={middleRows}
                    formatResolver={middleLeftFormatResolver}
                    showLeftBorder={true}
                    showTopBorder={!hasTopRows}
                    showRightBorder={true}
                    showBottomBorder={!hasBottomRows}
                    scrollTop={scrollRect.top}
                    scrollHeight={scrollRect.height}
                    borderWidth={borderWidth}
                    devicePixelRatio={devicePixelRatio}
                />
            </Conditional>

            <Conditional condition={hasMiddleColumns && hasMiddleRows}>
                <GridCanvas
                    style={{ gridRow: '2', gridColumn: '2' }}
                    data={data}
                    columns={middleColumns}
                    rows={middleRows}
                    formatResolver={middleMiddleFormatResolver}
                    showLeftBorder={!hasLeftColumns}
                    showTopBorder={!hasTopRows}
                    showRightBorder={!hasRightColumns}
                    showBottomBorder={!hasBottomRows}
                    scrollLeft={scrollRect.left}
                    scrollTop={scrollRect.top}
                    scrollWidth={scrollRect.width}
                    scrollHeight={scrollRect.height}
                    borderWidth={borderWidth}
                    devicePixelRatio={devicePixelRatio}
                />
            </Conditional>

            <Conditional condition={hasRightColumns && hasMiddleRows}>
                <GridCanvas
                    style={{ position: 'sticky', right: 0, zIndex: 1, gridRow: '2', gridColumn: '3' }}
                    data={data}
                    columns={rightColumns}
                    rows={middleRows}
                    formatResolver={middleRightFormatResolver}
                    showLeftBorder={hasMiddleColumns || !hasLeftColumns}
                    showTopBorder={!hasTopRows}
                    showRightBorder={true}
                    showBottomBorder={!hasBottomRows}
                    scrollTop={scrollRect.top}
                    scrollHeight={scrollRect.height}
                    borderWidth={borderWidth}
                    devicePixelRatio={devicePixelRatio}
                />
            </Conditional>

            <Conditional condition={hasLeftColumns && hasBottomRows}>
                <GridCanvas
                    style={{ position: 'sticky', left: 0, bottom: 0, zIndex: 2, gridRow: '3', gridColumn: '1' }}
                    data={data}
                    columns={leftColumns}
                    rows={bottomRows}
                    formatResolver={bottomLeftFormatResolver}
                    showLeftBorder={true}
                    showTopBorder={hasMiddleRows || !hasTopRows}
                    showRightBorder={true}
                    showBottomBorder={true}
                    borderWidth={borderWidth}
                    devicePixelRatio={devicePixelRatio}
                />
            </Conditional>

            <Conditional condition={hasMiddleColumns && hasBottomRows}>
                <GridCanvas
                    style={{ position: 'sticky', bottom: 0, zIndex: 1, gridRow: '3', gridColumn: '2' }}
                    data={data}
                    columns={middleColumns}
                    rows={bottomRows}
                    formatResolver={bottomMiddleFormatResolver}
                    showLeftBorder={!hasLeftColumns}
                    showTopBorder={hasMiddleRows || !hasTopRows}
                    showRightBorder={!hasRightColumns}
                    showBottomBorder={true}
                    scrollLeft={scrollRect.left}
                    scrollWidth={scrollRect.width}
                    borderWidth={borderWidth}
                    devicePixelRatio={devicePixelRatio}
                />
            </Conditional>

            <Conditional condition={hasRightColumns && hasBottomRows}>
                <GridCanvas
                    style={{ position: 'sticky', right: 0, bottom: 0, zIndex: 2, gridRow: '3', gridColumn: '3' }}
                    data={data}
                    columns={rightColumns}
                    rows={bottomRows}
                    formatResolver={bottomRightFormatResolver}
                    showLeftBorder={hasMiddleColumns || !hasLeftColumns}
                    showTopBorder={hasMiddleRows || !hasTopRows}
                    showRightBorder={true}
                    showBottomBorder={true}
                    borderWidth={borderWidth}
                    devicePixelRatio={devicePixelRatio}
                />
            </Conditional>

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
    defaultFormatting: PropTypes.arrayOf(PropTypes.any), // TODO: Fix type
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
            style: PropTypes.string,
            text: PropTypes.string
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
    rowsTop: [{ type: 'HEADER', height: 20 }],
    rowsBottom: [],
    defaultFormatting: [
        { column: { match: 'ANY' }, row: { match: 'HEADER' }, style: '{background: "#F5F5F5"}', value: 'column.header' },
        // TODO: Make sure that rules with "value" don't have any other fields
        { value: 'data[row.id][column.id]' }
    ],
    formatting: [],
    hoverCell: null,
    selectedCells: []
};

export default DashJsGrid;
