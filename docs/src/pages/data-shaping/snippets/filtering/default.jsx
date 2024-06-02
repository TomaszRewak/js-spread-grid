const [filters, setFilters] = useState([{ columnId: 'registered', expression: true }]); // eslint-disable-line

<SpreadGrid
    data={[
        // collapse: true
        // default data
        // collapse: false
    ]}
    rows={[
        { type: 'HEADER' },
        { type: 'FILTER' },
        { type: 'DATA-BLOCK' }
    ]}
    // collapse: true
    columns={[{ type: 'DATA-BLOCK', width: 70 }]}
    // collapse: false
    filters={filters}
    onFiltersChange={setFilters}
/>