import React from 'react';
import ReactDOM from 'react-dom/client';
import SpreadGrid from './spread-grid/components/SpreadGrid';

function App() {
    const column_widths = [100, 80, 80, 111, 73, 173, 73, 73, 73, 73, 73, 73, 73, 73, 73, 73, 73, 73, 73, 73, 73, 73, 73, 73, 73, 73, 73, 30, 100]
    const rows_count = 2000

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
                    { id: 'a', type: 'HEADER', height: 20 },
                    ...rows.slice(0, 4),
                    { id: 'b', type: 'HEADER', height: 20 },
                    ...rows.slice(4, -2),
                    { id: 'c', type: 'HEADER', height: 20 },
                    ...rows.slice(-2),
                    { id: 'd', type: 'HEADER', height: 20 }
                ]}
                pinnedTop={6}
                pinnedBottom={4}
                formatting={[
                    {
                        condition: ({row}) => row.index % 2 === 0,
                        style: { background: '#fbfbfb' }
                    },
                    {
                        condition: ({column, row}) => row.index < 25 && column.index > 3,
                        edit: {
                            validate: ({string}) => !isNaN(Number(string)),
                            parse: ({string}) => Number(string),
                        },
                        value: context => 'newValue' in context ? context.newValue : context.value,
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
                        column: { id: 'column_13' },
                        draw: ({ctx, value, column, row}) => {
                            ctx.fillStyle = 'pink';
                            ctx.fillRect(4, 4, Math.min(value / 20, column.width - 8), row.height - 8);
                        }
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
                        condition: ({value}) => value < 100,
                        text: ({value}) => `small [${value}]`
                    },
                    {
                        row: { id: 20 },
                        text: 'ABCDEFGHIJKLMNOPQRSTUVXYZ'
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
