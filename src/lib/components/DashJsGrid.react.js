/* eslint-disable import/prefer-default-export */
import React from 'react';
import PropTypes from 'prop-types';

function DashJsGrid({ title }) {
    return (
        <div>
            Test 2: {title}
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
