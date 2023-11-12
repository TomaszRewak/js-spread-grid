/* eslint-disable import/prefer-default-export */
import React from 'react';
import PropTypes from 'prop-types';
import GridCanvas from '../fragments/GridCanvas.react';

function DashJsGrid({ rowHeight }) {
    return (
        <div>
            <div style={{ display: 'flex' }}>
                <GridCanvas
                    rowHeight={rowHeight}
                    cells={[
                        [{ value: 'column 1' }, { value: 'column 2' }],
                        [{ value: '1' }, { value: '2' }]
                    ]}
                    columnWidths={[50, 67]}
                    showLeftBorder
                    showTopBorder
                />
                <GridCanvas
                    rowHeight={rowHeight}
                    cells={[
                        [{ value: 'column 3' }, { value: 'column 4' }, { value: 'column 5' }],
                        [{ value: '3' }, { value: '4' }, { value: '5' }]
                    ]}
                    columnWidths={[100, 151, 33]}
                    showTopBorder
                />
            </div>
            <div style={{ display: 'flex' }}>
                <GridCanvas
                    rowHeight={rowHeight}
                    cells={[
                        [{ value: '5' }, { value: '7' }],
                        [{ value: '11' }, { value: '12' }],
                        [{ value: '16' }, { value: '17' }],
                    ]}
                    columnWidths={[50, 67]}
                    showLeftBorder
                />
                <GridCanvas
                    rowHeight={rowHeight}
                    cells={[
                        [{ value: '8' }, { value: '9' }, { value: '10' }],
                        [{ value: '13' }, { value: '14' }, { value: '15' }],
                        [{ value: '18' }, { value: '19' }, { value: '20' }]
                    ]}
                    columnWidths={[100, 151, 33]}
                />
            </div>
        </div>
    );
};

DashJsGrid.propTypes = {
    // The height of each row
    rowHeight: PropTypes.number
};

DashJsGrid.defaultProps = {
    rowHeight: 20
};

export default DashJsGrid;
