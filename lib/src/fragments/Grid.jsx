/* eslint-disable import/prefer-default-export */
import React, { useState } from 'react';
import GridCanvas from './GridCanvas';
import GridInteractions from './GridInteractions';
import useDevicePixelRatio from '../hooks/useDevicePixelRatio';
import { MouseAndKeyboardProvider } from '../contexts/MouseAndKeyboardContext';
import { SizeAndScrollProvider } from '../contexts/SizeAndScrollContext';
import { ScrollRectProvider } from '../contexts/ScrollRectContext';
import { GridSectionProvider } from '../contexts/GridSectionContext';

const gridStyle = { maxWidth: 'fit-content', maxHeight: 'fit-content', overflow: 'auto', display: 'grid', position: 'relative', gridTemplateColumns: 'auto auto auto', gridTemplateRows: 'auto auto auto', outline: 'none' };
const topLeftStyle = { position: 'sticky', left: 0, top: 0, zIndex: 2, gridRow: '1', gridColumn: '1' };
const topCenterStyle = { position: 'sticky', top: 0, zIndex: 1, gridRow: '1', gridColumn: '2' };
const topRightStyle = { position: 'sticky', right: 0, top: 0, zIndex: 2, gridRow: '1', gridColumn: '3' };
const middleLeftStyle = { position: 'sticky', left: 0, zIndex: 1, gridRow: '2', gridColumn: '1' };
const middleCenterStyle = { gridRow: '2', gridColumn: '2' };
const middleRightStyle = { position: 'sticky', right: 0, zIndex: 1, gridRow: '2', gridColumn: '3' };
const bottomLeftStyle = { position: 'sticky', left: 0, bottom: 0, zIndex: 2, gridRow: '3', gridColumn: '1' };
const bottomCenterStyle = { position: 'sticky', bottom: 0, zIndex: 1, gridRow: '3', gridColumn: '2' };
const bottomRightStyle = { position: 'sticky', right: 0, bottom: 0, zIndex: 2, gridRow: '3', gridColumn: '3' };

// TODO: Write description
export default function Grid() {
    // TODO: Use intersection observer to only render the grid if it is in view
    // TODO: Selected columns (selected rows): [{columnId: 'col1', headerId: 'default'}]
    // TODO: Selected cells: [{rowId: 'row1', columnId: 'col1'}]
    // TODO: Sorting: [{columnId: 'col1', headerId: 'default' , direction: 'ASC'}]
    // TODO: Use headers (as well as fixed area boundaries) as separators and sort data only in between them
    // TODO: Allow rows/columns to have parentId (or groupId?) to group them together and filter/sort them as a group
    // TODO: wrap props into a function so that you can do setProps(prevProps => ...)

    const [container, setContainer] = useState(null);

    // TODO: Borders still seem to be blurry for large number of rows/columns
    // TODO: Canvases should get this from the state context
    const devicePixelRatio = useDevicePixelRatio();

    // TODO: Display left/right/top/bottom borders for all fixed rows and display them for middle cells if no fixed rows/columns are present
    // TODO: Memoize styles
    // TODO: Remove hardcoded width/height
    // TODO: Wrap the grid in another grid and set that grid's max width/height to the 100 vw/vh
    return (
        <div
            className='spread-grid'
            ref={setContainer}
            tabIndex={0}
            style={gridStyle}
        >
            <SizeAndScrollProvider element={container}>
                <ScrollRectProvider>
                    <GridSectionProvider horizontal='left' vertical='top'>
                        <GridCanvas style={topLeftStyle} devicePixelRatio={devicePixelRatio} />
                    </GridSectionProvider>

                    <GridSectionProvider horizontal='center' vertical='top'>
                        <GridCanvas style={topCenterStyle} devicePixelRatio={devicePixelRatio} />
                    </GridSectionProvider>

                    <GridSectionProvider horizontal='right' vertical='top'>
                        <GridCanvas style={topRightStyle} devicePixelRatio={devicePixelRatio} />
                    </GridSectionProvider>

                    <GridSectionProvider horizontal='left' vertical='middle'>
                        <GridCanvas style={middleLeftStyle} devicePixelRatio={devicePixelRatio} />
                    </GridSectionProvider>

                    <GridSectionProvider horizontal='center' vertical='middle'>
                        <GridCanvas style={middleCenterStyle} devicePixelRatio={devicePixelRatio} />
                    </GridSectionProvider>

                    <GridSectionProvider horizontal='right' vertical='middle'>
                        <GridCanvas style={middleRightStyle} devicePixelRatio={devicePixelRatio} />
                    </GridSectionProvider>

                    <GridSectionProvider horizontal='left' vertical='bottom'>
                        <GridCanvas style={bottomLeftStyle} devicePixelRatio={devicePixelRatio} />
                    </GridSectionProvider>

                    <GridSectionProvider horizontal='center' vertical='bottom'>
                        <GridCanvas style={bottomCenterStyle} devicePixelRatio={devicePixelRatio} />
                    </GridSectionProvider>

                    <GridSectionProvider horizontal='right' vertical='bottom'>
                        <GridCanvas style={bottomRightStyle} devicePixelRatio={devicePixelRatio} />
                    </GridSectionProvider>
                </ScrollRectProvider>

                <MouseAndKeyboardProvider element={container}>
                    <GridInteractions />
                </MouseAndKeyboardProvider>
            </SizeAndScrollProvider>
        </div>
    );
};
