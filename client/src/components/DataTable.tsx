import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DataTable: React.FC = () => {

    // Create a setter for each data.
    const [data, setData] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [collections, setCollections] = useState<string[]>([]);
    const [selectedCollection, setSelectedCollection] = useState('');
    const [fields, setFields] = useState<string[]>([]);
    const [field, setField] = useState('');
    const [query, setQuery] = useState('');

    // Function to fetch available collections or uploaded file.
    const fetchCollections = async () => {
        const res = await axios.get('http://localhost:3001/api/collections');
        setCollections(res.data);
        if (res.data.length > 0) {
            if (selectedCollection) {

            } else {
                setSelectedCollection(res.data[0]); // default to first collection
            }
        } 
    };

    // Function to fetch the data of the selected collection.
    const fetchData = async () => {
        if (!selectedCollection) return;

        try {
            const res = await axios.get(`http://localhost:3001/api/data`, {
                params: {
                    page,
                    limit: 10,
                    collection: selectedCollection
                }
            });
            setData(res.data.data);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error(err);
        }
    };

    // Function to fetch the data of the selected collection.
    const fetchFields = async () => {
        if (!selectedCollection) return;

        try {
            const res = await axios.get(`http://localhost:3001/api/collection-fields`, {
                params: {
                    collection: selectedCollection
                }
            });
            setFields(res.data.fields);
        } catch (err) {
            console.error(err);
        }
    };

    // Function to fetch the data of the selected collection after filtered using a search term.
    const handleSearch = async () => {
        if (!selectedCollection || !query) {
            fetchData();
            return;
        }

        try {
            const res = await axios.get(`http://localhost:3001/api/search`, {
                params: {
                    field: field,
                    q: query,
                    collection: selectedCollection
                }
            });
            setData(res.data);
            setTotalPages(1);
        } catch (err) {
            console.error(err);
        }
    };

    // Run fetchCollections after finishing initial rendering.
    useEffect(() => {
        fetchCollections();
    }, []);


    // Run fetchData if the selectedCollection or page are modified.
    useEffect(() => {
        if (selectedCollection) fetchData();
    }, [selectedCollection, page]);
    

    return (
        <div>
            <h2>Table Data</h2>

            <div style={{ marginBottom: '10px' }}>
                <label>Select File: </label>
                <select
                    value={selectedCollection}
                    onClick={() => {
                        fetchCollections();
                    }}
                    onChange={(e) => {
                        setSelectedCollection(e.target.value);
                        setField('');
                        setPage(1); // Reset to first page when collection changes
                    }}
                >
                    {collections.map((col) => (
                        <option key={col} value={col}>{col}</option>
                    ))}
                </select>
            </div>

            <>
                <select 
                    value={field} 
                    onChange={(e) => setField(e.target.value)}
                    onClick={() => {
                        fetchFields();
                    }}
                >
                {fields.map(f => <option key={f} value={f}>{f}</option>)}
                </select>

                <input value={query} onChange={e => setQuery(e.target.value)} />
                <button onClick={handleSearch}>Search</button>
            </>

            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                    <tr>
                    {data[0] &&
                        Object.keys(data[0])
                            .filter(key => key !== '_id' && key !== '__v')
                            .map(key => (
                            <th
                                key={key}
                                style={{
                                border: '1px solid black',
                                padding: '10px',
                                backgroundColor: '#f0f0f0',
                                textAlign: 'left',
                                }}
                            >
                                {key}
                            </th>
                            ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                    <tr key={index}>
                        {Object.entries(item)
                        .filter(([key]) => key !== '_id' && key !== '__v')
                        .map(([_, value], idx) => (
                            <td
                            key={idx}
                            style={{
                                border: '1px solid black',
                                padding: '10px',
                            }}
                            >
                            {typeof value === 'object' ? JSON.stringify(value) : value?.toString()}
                            </td>
                        ))}
                    </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ marginTop: '10px' }}>
                <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
                <span> Page {page} of {totalPages} </span>
                <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
        </div>
    );
};

export default DataTable;
