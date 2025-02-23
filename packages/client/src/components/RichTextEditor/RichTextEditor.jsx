import React, { useState, useRef, useMemo, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill-new';
import ImageResize from 'quill-image-resize';
import 'react-quill-new/dist/quill.snow.css';
import { useDispatch } from 'react-redux';
import { uploadArticlePic } from '../../store/slice/photoSlice';

Quill.register('modules/imageResize', ImageResize);

const RichTextEditor = ({ value, onChange }) => {
    const [content, setContent] = useState(value);
    const quillRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        setContent(value);
    }, [value]);

    const handleChange = (content, delta, source, editor) => {
        setContent(content);
        onChange(content);
    };

    const handleImageUpload = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];

            const formData = new FormData();
            formData.append('articleFile', file);

            const url = await dispatch(uploadArticlePic(formData));
            const imageUrl = url.payload;

            const quill = quillRef.current.getEditor();
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, 'image', imageUrl);
            handleChange(quill.root.innerHTML);
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
                // [{ color: ["red", "#235AF3", '#fff'] }],
            ],
            // handlers: {
            //     // image: handleImageUpload,
            // },
        },
        imageResize: {
            parchment: Quill.import('parchment'),
            modules: ['Resize', 'DisplaySize',
                // 'Toolbar'
            ],
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