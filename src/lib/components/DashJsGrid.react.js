/* eslint-disable import/prefer-default-export */
import React from 'react';
import PropTypes from 'prop-types';
import GridCanvas from '../fragments/GridCanvas.react';

function DashJsGrid({ title }) {
    return (
        <div>
            Test 2: {title}
            <GridCanvas cells={[
                [{ value: '1' }, { value: '2' }, { value: '3' }],
                [{ value: '4' }, { value: '5' }, { value: '6' }],
                [{ value: '7' }, { value: '8' }, { value: '9' }],
            ]} />
        </div>
    );
};

DashJsGrid.propTypes = {
    // The header text of the component
    title: PropTypes.string.isRequired,
};

DashJsGrid.defaultProps = {
    title: 'Hello World!'
};

export default DashJsGrid;
