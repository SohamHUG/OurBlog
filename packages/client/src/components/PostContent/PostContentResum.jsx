import React from 'react';
import DOMPurify from 'dompurify';

const PostContentResum = ({ content }) => {
    // Nettoyage du contenu HTML
    const sanitizedContent = DOMPurify.sanitize(content);

    // Extraction du texte brut en excluant les balises HTML
    const plainText = sanitizedContent.replace(/<[^>]+>/g, '');

    return (
        <div>
            {plainText.length > 150 ? `${plainText.substring(0, 140)}...` : plainText}
        </div>
    );
};

export default PostContentResum;
