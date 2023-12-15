import React from 'react';
import ReactDOM from 'react-dom/client';
import SpreadGrid from './spread-grid/components/SpreadGrid';

function App() {
    const column_widths = [100, 80, 80, 111, 73, 173, 73, 73, 73, 73, 73, 73, 73, 73, 73, 73, 73, 73, 73, 30, 100]
    const rows_count = 2300

    const columns = column_widths.map((width, i) => ({
        id: `column_${i}`,
        header: `Column ${i}`,
        width
    }))

    const rows = Array.from({ length: rows_count }, (_, i) => ({
        id: i,
        height: 20
    }))

    const data = rows.map((_, i) => ({
        ...columns.reduce((acc, _, j) => ({ ...acc, [`column_${j}`]: i * columns.length + j }), {})
    }))

    return (
        <div style={{ maxHeight: '90vh', display: 'flex' }}>
            <SpreadGrid
                data={data}
                columnsLeft={columns.slice(0, 2)}
                columns={columns.slice(2, -1)}
                columnsRight={columns.slice(-1)}
                rowsTop={[
                    { id: 'top', type: 'HEADER', height: 20 },
                    ...rows.slice(0, 2),
                    { id: 100, height: 7 },
                    { id: 101, height: 50 },
                    { id: 102, height: 50 },
                    { id: 103, height: 50 },
                    ...rows.slice(8, 10),
                    { type: 'HEADER', height: 20 }
                ]}
                rows={rows.slice(2, -2)}
                rowsBottom={[
                    { type: 'HEADER', height: 20 },
                    ...rows.slice(-2),
                    { type: 'HEADER', height: 20 }
                ]}
                formatting={[
                    {
                        condition: (data, rows, columns, row, column, value) => row.index % 2 === 0,
                        style: { background: '#fdfdfd' }
                    },
                    {
                        column: { id: 'column_11' },
                        style: (data, rows, columns, row, column, value) => ({ background: `rgb(${value % 255}, 100, 100)` })
                    },
                    {
                        column: { id: 'column_5' },
                        style: { background: 'lightgreen' }
                    },
                    {
                        row: { id: 6 },
                        style: (data, rows, columns, row, column, value) => ({ background: 'lightblue' })
                    },
                    {
                        row: { id: 6 },
                        column: { id: 'column_5' },
                        style: (data, rows, columns, row, column, value) => ({ background: 'lightcoral' })
                    },
                    {
                        row: { id: 5 },
                        column: { id: 'column_5' },
                        style: (data, rows, columns, row, column, value) => ({ borderLeft: { width: 3 }, borderTop: { width: 3 }, borderRight: { width: 3 } })
                    },
                    {
                        row: { id: 6 },
                        column: { id: 'column_4' },
                        style: (data, rows, columns, row, column, value) => ({ borderLeft: { width: 3 }, borderTop: { width: 3 }, borderBottom: { width: 3 } })
                    },
                    {
                        row: { id: 6 },
                        column: { id: 'column_6' },
                        style: (data, rows, columns, row, column, value) => ({ borderTop: { width: 3 }, borderBottom: { width: 3 }, borderRight: { width: 3 } })
                    },
                    {
                        row: { id: 7 },
                        column: { id: 'column_5' },
                        style: (data, rows, columns, row, column, value) => ({ borderLeft: { width: 3 }, borderRight: { width: 3 }, borderBottom: { width: 3 } })
                    },
                    {
                        column: { index: 0 },
                        style: (data, rows, columns, row, column, value) => ({ borderLeft: { width: 1 } })
                    },
                    {
                        column: { index: 1 },
                        style: (data, rows, columns, row, column, value) => ({ borderRight: { width: 1, color: 'red' }, background: 'lightgrey' })
                    },
                    {
                        column: { index: 6 },
                        style: (data, rows, columns, row, column, value) => ({ borderLeft: { width: 5, dash: [15, 15] }, borderRight: { width: 5, dash: [15, 15] }, background: 'lightgrey' })
                    },
                    {
                        condition: (data, rows, columns, row, column, value) => value < 70,
                        value: (data, rows, columns, row, column, value) => 'small [jjj]'
                    },
                    {
                        condition: (data, rows, columns, row, column, value) => value < 100,
                        value: (data, rows, columns, row, column, value) => 'SMALL'
                    },
                    {
                        row: { id: 20 },
                        value: (data, rows, columns, row, column, value) => 'ABCDEFGHIJKLMNOPQRSTUVXYZ'
                    },
                    {
                        column: { id: 'column_5' },
                        style: (data, rows, columns, row, column, value) => ({ textAlign: 'right' })
                    },
                    {
                        column: { id: 'column_3' },
                        style: (data, rows, columns, row, column, value) => ({ textAlign: 'center', textBaseline: 'bottom' })
                    },
                    {
                        row: { id: 101 },
                        style: (data, rows, columns, row, column, value) => ({ textBaseline: 'top' })
                    },
                    {
                        row: { id: 102 },
                        style: (data, rows, columns, row, column, value) => ({ textBaseline: 'middle' })
                    },
                    {
                        row: { id: 103 },
                        style: (data, rows, columns, row, column, value) => ({ textBaseline: 'bottom' })
                    }
                ]}
            />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
