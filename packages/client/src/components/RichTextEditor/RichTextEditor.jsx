import React, { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'; // Style de l'éditeur

const RichTextEditor = ({ onChange }) => {
    const [value, setValue] = useState('');

    const handleChange = (content) => {
        setValue(content);
        if (onChange) {
            onChange(content);
            // console.log(content)
        }
    };

    const modules = {
        toolbar: {
            container: [
                [{ header: [false] }], // Headers
                ['bold', 'italic', 'underline'], // Text formatting
                [{ list: 'ordered' }, { list: 'bullet' }], // Lists
                ['link', 'image'], // Links and images
                ['clean'], // Remove formatting
            ],
        },
    };

    return (
        <ReactQuill
            value={value}
            onChange={handleChange}
            modules={modules}
            theme="snow"
            placeholder="Écrivez votre article ici..."
            style={{
                border: '1px solid #ccc',
                borderRadius: '5px',
                minHeight: '200px',
            }}
        />
    );
};

export default RichTextEditor;
