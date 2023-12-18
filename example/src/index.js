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
        <div style={{ maxHeight: 'calc(100vh - 20px)', display: 'flex' }}>
            <SpreadGrid
                data={data}
                columns={columns}
                pinnedLeft={2}
                pinnedRight={1}
                rows={[
                    { id: 'top', type: 'HEADER', height: 20 },
                    ...rows.slice(0, 2),
                    { id: 100, height: 7 },
                    { id: 101, height: 50 },
                    { id: 102, height: 50 },
                    { id: 103, height: 50 },
                    ...rows.slice(8, 10),
                    { type: 'HEADER', height: 20 },
                    ...rows.slice(2, -2),
                    { type: 'HEADER', height: 20 },
                    ...rows.slice(-2),
                    { type: 'HEADER', height: 20 }
                ]}
                pinnedTop={10}
                pinnedBottom={4}
                formatting={[
                    {
                        condition: ({row}) => row.index % 2 === 0,
                        style: { background: '#fbfbfb' }
                    },
                    {
                        column: { id: 'column_11' },
                        style: ({value}) => ({ background: `rgb(${value % 255}, 100, 100)` })
                    },
                    {
                        column: { id: 'column_5' },
                        style: { background: 'lightgreen' }
                    },
                    {
                        row: { id: 6 },
                        style: { background: 'lightblue' }
                    },
                    {
                        row: { id: 6 },
                        column: { id: 'column_5' },
                        style: { background: 'lightcoral' }
                    },
                    {
                        row: { id: 5 },
                        column: { id: 'column_5' },
                        style: { borderLeft: { width: 3 }, borderTop: { width: 3 }, borderRight: { width: 3 } }
                    },
                    {
                        row: { id: 6 },
                        column: { id: 'column_4' },
                        style: { borderLeft: { width: 3 }, borderTop: { width: 3 }, borderBottom: { width: 3 } }
                    },
                    {
                        row: { id: 6 },
                        column: { id: 'column_6' },
                        style: { borderTop: { width: 3 }, borderBottom: { width: 3 }, borderRight: { width: 3 } }
                    },
                    {
                        row: { id: 7 },
                        column: { id: 'column_5' },
                        style: { borderLeft: { width: 3 }, borderRight: { width: 3 }, borderBottom: { width: 3 } }
                    },
                    {
                        column: { index: 0 },
                        style: { borderLeft: { width: 1 } }
                    },
                    {
                        column: { index: 1 },
                        style: { borderRight: { width: 1, color: 'red' }, background: 'lightgrey' }
                    },
                    {
                        column: { index: 6 },
                        style: { borderLeft: { width: 5, dash: [15, 15] }, borderRight: { width: 5, dash: [15, 15] }, background: 'lightgrey' }
                    },
                    {
                        condition: ({value}) => value < 70,
                        value: () => 'small [jjj]'
                    },
                    {
                        condition: ({value}) => value < 100,
                        value: () => 'SMALL'
                    },
                    {
                        row: { id: 20 },
                        value: () => 'ABCDEFGHIJKLMNOPQRSTUVXYZ'
                    },
                    {
                        column: { id: 'column_5' },
                        style: { textAlign: 'right' }
                    },
                    {
                        column: { id: 'column_3' },
                        style: { textAlign: 'center', textBaseline: 'bottom' }
                    },
                    {
                        row: { id: 101 },
                        style: { textBaseline: 'top' }
                    },
                    {
                        row: { id: 102 },
                        style: { textBaseline: 'middle' }
                    },
                    {
                        row: { id: 103 },
                        style: { textBaseline: 'bottom' }
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
