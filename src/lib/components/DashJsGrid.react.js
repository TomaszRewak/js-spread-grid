/* eslint-disable import/prefer-default-export */
import React from 'react';
import PropTypes from 'prop-types';
import GridCanvas from '../fragments/GridCanvas.react';

function DashJsGrid({ rowHeight }) {
    return (
        <>
            <GridCanvas
                rowHeight={rowHeight}
                cells={[
                    [{ value: '1' }, { value: '2' }, { value: '3' }],
                    [{ value: '4' }, { value: '5' }, { value: '6' }],
                    [{ value: '7' }, { value: '8' }, { value: '9' }],
                    [{ value: '10' }, { value: '11' }, { value: '12' }],
                    [{ value: '13' }, { value: '14' }, { value: '15' }]
                ]}
                columnWidths={[100, 151, 33]}
            />
        </>
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
