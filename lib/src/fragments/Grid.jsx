/* eslint-disable import/prefer-default-export */
import React, { useMemo, useState } from 'react';
import GridCanvas from './GridCanvas';
import useScrollRect from '../hooks/useScrollRect';
import stringifyId from '../utils/stringifyId';
import GridInteractions from './GridInteractions';
import useDevicePixelRatio, { roundToPixels } from '../hooks/useDevicePixelRatio';
import Conditional from './Conditional';
import { InteractionsProvider } from '../contexts/InteractionsContext';
import { useColumns, useRows, usePinnedTop, usePinnedBottom, usePinnedLeft, usePinnedRight } from '../contexts/StateContext';

function useIndexedDefinitions(definitions) {
    return useMemo(() => {
        return definitions.map((definition, index) => ({
            ...definition,
            index,
            key: stringifyId(definition.id),
        }));
    }, [definitions]);
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

function useSlice(array, start, end) {
    return useMemo(() => array.slice(start, end), [array, start, end]);
}

// TODO: Write description
export default function Grid() {
    // TODO: Use intersection observer to only render the grid if it is in view
    // TODO: Selected columns (selected rows): [{columnId: 'col1', headerId: 'default'}]
    // TODO: Selected cells: [{rowId: 'row1', columnId: 'col1'}]
    // TODO: Sorting: [{columnId: 'col1', headerId: 'default' , direction: 'ASC'}]
    // TODO: Use headers (as well as fixed area boundaries) as separators and sort data only in between them
    // TODO: Allow rows/columns to have parentId (or groupId?) to group them together and filter/sort them as a group
    // TODO: wrap props into a function so that you can do setProps(prevProps => ...)

    console.count('render Grid');

    const [container, setContainer] = useState(null);
    const [fixedTop, setFixedTop] = useState(null);
    const [fixedBottom, setFixedBottom] = useState(null);
    const [fixedLeft, setFixedLeft] = useState(null);
    const [fixedRight, setFixedRight] = useState(null);

    // TODO: Borders still seem to be blurry for large number of rows/columns
    const devicePixelRatio = useDevicePixelRatio();
    const borderWidth = 1 / devicePixelRatio;

    const columns = useColumns();
    const rows = useRows();

    const pinnedTop = usePinnedTop();
    const pinnedBottom = usePinnedBottom();
    const pinnedLeft = usePinnedLeft();
    const pinnedRight = usePinnedRight();

    const columnsLeft = useSlice(columns, 0, pinnedLeft);
    const columnsMiddle = useSlice(columns, pinnedLeft, columns.length - pinnedRight);
    const columnsRight = useSlice(columns, columns.length - pinnedRight, columns.length);
    const rowsTop = useSlice(rows, 0, pinnedTop);
    const rowsMiddle = useSlice(rows, pinnedTop, rows.length - pinnedBottom);
    const rowsBottom = useSlice(rows, rows.length - pinnedBottom, rows.length);

    const scrollRect = useScrollRect(container, fixedLeft, fixedTop, fixedRight, fixedBottom);

    const hasLeftColumns = columnsLeft.length > 0;
    const hasMiddleColumns = columnsMiddle.length > 0;
    const hasRightColumns = columnsRight.length > 0;
    const hasTopRows = rowsTop.length > 0;
    const hasMiddleRows = rowsMiddle.length > 0;
    const hasBottomRows = rowsBottom.length > 0;

    // TODO: Display left/right/top/bottom borders for all fixed rows and display them for middle cells if no fixed rows/columns are present
    // TODO: Memoize styles
    // TODO: Remove hardcoded width/height
    // TODO: Wrap the grid in another grid and set that grid's max width/height to the 100 vw/vh
    return (
        <div
            className='spread-grid'
            ref={setContainer}
            tabIndex={0}
            style={{ maxWidth: 'fit-content', maxHeight: 'fit-content', overflow: 'auto', display: 'grid', position: 'relative', gridTemplateColumns: 'auto auto auto', gridTemplateRows: 'auto auto auto', outline: 'none' }}
        >
            <div ref={setFixedLeft} style={{ gridRow: '1 / 4', gridColumn: '1' }} />
            <div ref={setFixedRight} style={{ gridRow: '1 / 4', gridColumn: '3' }} />
            <div ref={setFixedTop} style={{ gridRow: '1', gridColumn: '1 / 4' }} />
            <div ref={setFixedBottom} style={{ gridRow: '3', gridColumn: '1 / 4' }} />

            <Conditional condition={hasLeftColumns && hasTopRows}>
                <GridCanvas
                    style={{ position: 'sticky', left: 0, top: 0, zIndex: 2, gridRow: '1', gridColumn: '1' }}
                    columns={columnsLeft}
                    rows={rowsTop}
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
                    columns={columnsMiddle}
                    rows={rowsTop}
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
                    columns={columnsRight}
                    rows={rowsTop}
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
                    columns={columnsLeft}
                    rows={rowsMiddle}
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
                    columns={columnsMiddle}
                    rows={rowsMiddle}
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
                    columns={columnsRight}
                    rows={rowsMiddle}
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
                    columns={columnsLeft}
                    rows={rowsBottom}
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
                    columns={columnsMiddle}
                    rows={rowsBottom}
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
                    columns={columnsRight}
                    rows={rowsBottom}
                    showLeftBorder={hasMiddleColumns || !hasLeftColumns}
                    showTopBorder={hasMiddleRows || !hasTopRows}
                    showRightBorder={true}
                    showBottomBorder={true}
                    borderWidth={borderWidth}
                    devicePixelRatio={devicePixelRatio}
                />
            </Conditional>

            <InteractionsProvider element={container}>
                <GridInteractions
                    borderWidth={borderWidth}
                />
            </InteractionsProvider>
        </div>
    );
};
