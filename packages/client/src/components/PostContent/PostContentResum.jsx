import React from 'react';
import DOMPurify from 'dompurify';

const PostContentResum = ({ content }) => {
    // Nettoyage du contenu HTML
    const sanitizedContent = DOMPurify.sanitize(content);

    // Extraction du texte brut en excluant les balises HTML
    // const plainText = sanitizedContent.replace(/<[^>]+>/g, '');


    let filteredContent = sanitizedContent
        .replace(/<(?!\/?(ul|ol|li|img)\b)[^>]*>/gi, '');

    // Conserver uniquement la première image
    let imageFound = false;
    filteredContent = filteredContent.replace(/<img [^>]*>/gi, (imgTag) => {
        if (!imageFound) {
            imageFound = true;
            return imgTag; // Conserver la première image
        }
        return ''; // Supprimer les autres images
    });

    // si le contenu est trop long
    const resumContent =
        filteredContent.length > 200
            ? `${filteredContent.substring(0, 200)}...`
            : filteredContent;

    return (
        <div
            dangerouslySetInnerHTML={{ __html: resumContent }}
        />
    );
};

export default PostContentResum;
