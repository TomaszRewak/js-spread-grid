import { useState } from 'react';
import SpreadGrid from 'react-spread-gird';

export default function Example({ data }) {
    // collapse: false
    const [hiddenColumns, setHiddenColumns] = useState(['team', 'registered']);
    const [hiddenRows, setHiddenRows] = useState(['Alice']);
    const [layout, setLayout] = useState({});

    return <SpreadGrid
        {...layout}
        data={data}
        columns={[{ type: 'HEADER' }, { type: 'DATA-BLOCK' }]}
        rows={[{ type: 'HEADER' }, { type: 'DATA-BLOCK' }]}
        hiddenColumns={hiddenColumns}
        hiddenRows={hiddenRows}
        onHiddenColumnsChange={setHiddenColumns}
        onHiddenRowsChange={setHiddenRows}
        onLayoutChange={({ version, ...layout }) => setLayout(layout)}
    />;
    // collapse: true
}