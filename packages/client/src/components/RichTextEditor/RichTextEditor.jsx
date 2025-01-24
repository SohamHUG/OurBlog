import React, { useState, useRef, useMemo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const RichTextEditor = ({ value, onChange }) => {
    const [content, setContent] = useState(value || '');
    const quillRef = useRef(null);

    const handleChange = (content, delta, source, editor) => {
        // if (source === 'user') {
        setContent(content);
        // if (onChange) {
        onChange(content);
        // }
        // }
    };

    const handleImageUpload = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            const formData = new FormData();
            formData.append('file', file);

            // Envoyez l'image à Cloudinary
            const response = await fetch('http://localhost:3000/upload/article-files', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            const data = await response.json();
            // console.log(data)
            const imageUrl = data.url;

            const quill = quillRef.current
            // console.log(quill)
            // Insérez l'image dans l'éditeur
            const range = quill.getEditor().getSelection(true);
            // console.log(range)
            quill.getEditor().insertEmbed(range.index, 'image', imageUrl);
            handleChange(quill.value);
        };
    };

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ font: [] }],
                [{ align: ["right", "center", "justify"] }],
                [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                ['link', 'image'],
                [{ color: ["red", "#235AF3"] }],
            ],
            handlers: {
                image: handleImageUpload,
            },
        },
    }), []);

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "link",
        "color",
        "align",
        "font",
        'indent',
        "image"
    ];

    return (
        <ReactQuill
            ref={quillRef}
            value={content}
            onChange={handleChange}
            modules={modules}
            formats={formats}
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
