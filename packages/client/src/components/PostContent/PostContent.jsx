import React from 'react';
import DOMPurify from 'dompurify';

const PostContent = ({ content }) => {
    // Nettoyage du contenu HTML
    const sanitizedContent = DOMPurify.sanitize(content);

    return (
        <div className="post-content" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
    );
};

export default PostContent;