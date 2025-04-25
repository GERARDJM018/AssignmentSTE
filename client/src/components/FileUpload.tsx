import React, { useState } from 'react';
import axios from 'axios';

const FileUpload: React.FC = () => {

    // Create a setter for progress
    const [progress, setProgress] = useState(0);

    // Function to handle upload of data to the backend.
    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post('http://localhost:3001/api/upload', formData, {
                onUploadProgress: (e) => {
                    setProgress(Math.round((e.loaded * 100) / e.total!));
                },
            });
            alert('Upload successful!');
            setProgress(0);
        } catch (err) {
            console.error(err);
            alert('Upload failed!');
        }
    };

    return (
        <div>
            <input type="file" accept=".csv" onChange={handleUpload} />
            {progress > 0 && <progress value={progress} max="100" />}<br/>
        </div>
    );
};

export default FileUpload;