import createGrid from 'js-spread-grid';

const element = document.getElementById('grid');
// collapse: false
createGrid(element, {
    data,
    columns: [{ type: 'HEADER' }, { type: 'DATA-BLOCK' }],
    rows: [{ type: 'HEADER' }, { type: 'DATA-BLOCK' }],
    hiddenColumns: ['team', 'registered'],
    hiddenRows: ['Alice'],
    onLayoutChange: layout => console.log('Applied layout:', layout)
});