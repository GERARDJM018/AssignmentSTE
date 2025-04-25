import React from 'react';
import FileUpload from './components/FileUpload';
import DataTable from './components/DataTable';


// Main app function
// Create title and components
function App() {
    return <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">CSV Upload App</h1> 
        <FileUpload /> 
        <DataTable />
    </div>;
};

export default App;