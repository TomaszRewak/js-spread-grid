/* eslint-disable import/prefer-default-export */
import React, { useState } from 'react';
import GridCanvas from './GridCanvas';
import GridInteractions from './GridInteractions';
import useDevicePixelRatio from '../hooks/useDevicePixelRatio';
import { MouseAndKeyboardProvider } from '../contexts/MouseAndKeyboardContext';
import { useColumns, useRows, usePinned } from '../contexts/StateContext';
import { SizeAndScrollProvider } from '../contexts/SizeAndScrollContext';
import { ScrollRectProvider } from '../contexts/ScrollRectContext';
import { GridSectionProvider } from '../contexts/GridSectionContext';

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

    // TODO: Borders still seem to be blurry for large number of rows/columns
    // TODO: Canvases should get this from the state context
    const devicePixelRatio = useDevicePixelRatio();

    const columns = useColumns();
    const rows = useRows();

    const pinned = usePinned();

    // TODO: Move to the GridSectionContext
    const hasLeftColumns = pinned.left > 0;
    const hasMiddleColumns = columns.length - pinned.left - pinned.right > 0;
    const hasRightColumns = pinned.right > 0;
    const hasTopRows = pinned.top > 0;
    const hasMiddleRows = rows.length - pinned.top - pinned.bottom > 0;
    const hasBottomRows = pinned.bottom > 0;

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
            <SizeAndScrollProvider element={container}>
                <ScrollRectProvider>
                    <GridSectionProvider horizontal='left' vertical='top'>
                        <GridCanvas
                            style={{ position: 'sticky', left: 0, top: 0, zIndex: 2, gridRow: '1', gridColumn: '1' }}
                            showLeftBorder={true}
                            showTopBorder={true}
                            showRightBorder={true}
                            showBottomBorder={true}
                            devicePixelRatio={devicePixelRatio}
                        />
                    </GridSectionProvider>

                    <GridSectionProvider horizontal='middle' vertical='top'>
                        <GridCanvas
                            style={{ position: 'sticky', top: 0, zIndex: 1, gridRow: '1', gridColumn: '2' }}
                            showLeftBorder={!hasLeftColumns}
                            showTopBorder={true}
                            showRightBorder={!hasRightColumns}
                            showBottomBorder={true}
                            devicePixelRatio={devicePixelRatio}
                        />
                    </GridSectionProvider>

                    <GridSectionProvider horizontal='right' vertical='top'>
                        <GridCanvas
                            style={{ position: 'sticky', right: 0, top: 0, zIndex: 2, gridRow: '1', gridColumn: '3' }}
                            showLeftBorder={hasMiddleColumns || !hasLeftColumns}
                            showTopBorder={true}
                            showRightBorder={true}
                            showBottomBorder={true}
                            devicePixelRatio={devicePixelRatio}
                        />
                    </GridSectionProvider>

                    <GridSectionProvider horizontal='left' vertical='middle'>
                        <GridCanvas
                            style={{ position: 'sticky', left: 0, zIndex: 1, gridRow: '2', gridColumn: '1' }}
                            showLeftBorder={true}
                            showTopBorder={!hasTopRows}
                            showRightBorder={true}
                            showBottomBorder={!hasBottomRows}
                            devicePixelRatio={devicePixelRatio}
                        />
                    </GridSectionProvider>

                    <GridSectionProvider horizontal='middle' vertical='middle'>
                        <GridCanvas
                            style={{ gridRow: '2', gridColumn: '2' }}
                            showLeftBorder={!hasLeftColumns}
                            showTopBorder={!hasTopRows}
                            showRightBorder={!hasRightColumns}
                            showBottomBorder={!hasBottomRows}
                            devicePixelRatio={devicePixelRatio}
                        />
                    </GridSectionProvider>

                    <GridSectionProvider horizontal='right' vertical='middle'>
                        <GridCanvas
                            style={{ position: 'sticky', right: 0, zIndex: 1, gridRow: '2', gridColumn: '3' }}
                            showLeftBorder={hasMiddleColumns || !hasLeftColumns}
                            showTopBorder={!hasTopRows}
                            showRightBorder={true}
                            showBottomBorder={!hasBottomRows}
                            devicePixelRatio={devicePixelRatio}
                        />
                    </GridSectionProvider>

                    <GridSectionProvider horizontal='left' vertical='bottom'>
                        <GridCanvas
                            style={{ position: 'sticky', left: 0, bottom: 0, zIndex: 2, gridRow: '3', gridColumn: '1' }}
                            showLeftBorder={true}
                            showTopBorder={hasMiddleRows || !hasTopRows}
                            showRightBorder={true}
                            showBottomBorder={true}
                            devicePixelRatio={devicePixelRatio}
                        />
                    </GridSectionProvider>

                    <GridSectionProvider horizontal='middle' vertical='bottom'>
                        <GridCanvas
                            style={{ position: 'sticky', bottom: 0, zIndex: 1, gridRow: '3', gridColumn: '2' }}
                            showLeftBorder={!hasLeftColumns}
                            showTopBorder={hasMiddleRows || !hasTopRows}
                            showRightBorder={!hasRightColumns}
                            showBottomBorder={true}
                            devicePixelRatio={devicePixelRatio}
                        />
                    </GridSectionProvider>

                    <GridSectionProvider horizontal='right' vertical='bottom'>
                        <GridCanvas
                            style={{ position: 'sticky', right: 0, bottom: 0, zIndex: 2, gridRow: '3', gridColumn: '3' }}
                            showLeftBorder={hasMiddleColumns || !hasLeftColumns}
                            showTopBorder={hasMiddleRows || !hasTopRows}
                            showRightBorder={true}
                            showBottomBorder={true}
                            devicePixelRatio={devicePixelRatio}
                        />
                    </GridSectionProvider>
                </ScrollRectProvider>

                <MouseAndKeyboardProvider element={container}>
                    <GridInteractions />
                </MouseAndKeyboardProvider>
            </SizeAndScrollProvider>
        </div>
    );
};
