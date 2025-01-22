import React from 'react';
import DOMPurify from 'dompurify';

const PostContent = ({ content }) => {
    // Nettoyage du contenu HTML
    const sanitizedContent = DOMPurify.sanitize(content);

    return (
        <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
    );
};

export default PostContent;