const [sortBy, setSortBy] = useState([{ columnId: "age", direction: "ASC" }]); // eslint-disable-line

<SpreadGrid
    data={[
        // collapse: true
        // default data
        // collapse: false
    ]}
    // collapse: true
    columns={[{ type: 'DATA-BLOCK', width: 70 }]}
    // collapse: false
    sortBy={sortBy}
    onSortByChange={setSortBy}
/>