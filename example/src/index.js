import React from 'react';
import ReactDOM from 'react-dom/client';
import SpreadGrid from './spread-grid/components/SpreadGrid';

function App() {
    return (
        <SpreadGrid
            data={[
                { id: 1, name: 'John', age: 20 },
                { id: 2, name: 'Jane', age: 21 },
                { id: 3, name: 'Joe', age: 22 },
                { id: 4, name: 'Jack', age: 23 },
                { id: 5, name: 'Jill', age: 24 }
            ]}
            columns={[
                { id: 'id', header: 'Id', width: 200 },
                { id: 'name', header: 'Name', width: 200 },
                { id: 'age', header: 'Age', width: 200 }
            ]}
            rowsTop={[
                { 'type': 'HEADER', 'height': 20 }
            ]}
            rows={[
                { id: 0, height: 20 },
                { id: 1, height: 20 },
                { id: 2, height: 20 },
                { id: 3, height: 20 },
                { id: 4, height: 20 }
            ]}
        />
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
