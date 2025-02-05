import React from 'react';
import DOMPurify from 'dompurify';
import 'react-quill-new/dist/quill.snow.css';

const PostContent = ({ content }) => {
    // Nettoyage du contenu HTML
    const sanitizedContent = DOMPurify.sanitize(content);

    return (
        <div className="post-content ql-editor" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
    );
};

export default PostContent;