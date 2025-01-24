import React from 'react';
import DOMPurify from 'dompurify';

const PostContentResum = ({ content }) => {
    // Nettoyage du contenu HTML
    const sanitizedContent = DOMPurify.sanitize(content);

    // console.log(sanitizedContent)

    // Extraction du texte brut en excluant les balises HTML
    const plainText = sanitizedContent.replace(/<[^>]+>/g, '');

    // conserver les images 
    // let filteredContent = sanitizedContent.replace(/<(?!\/?(img)\b)[^>]*>/gi, '');

    // console.log(filteredContent)
    // conserver uniquement la première image
    let image = '';
    let imageFound = false;

    sanitizedContent.replace(/<img [^>]*>/gi, (imgTag) => {
        if (!imageFound) {
            imageFound = true;
            image = imgTag // Conserver la première image
            // return imgTag; 
        }
        return ''; // Supprimer les autres images
    });

    // console.log(plainText.length)


    // image par défaut si l'article n'en a pas 
    if (!imageFound) {
        image = `<img src="https://res.cloudinary.com/dni6ctpie/image/upload/v1737703757/files/mgdxrfu47rczvfdngkst.png" alt="Default" />`;
    }

    // réduis le contenu 
    const resumContent =
        plainText.length > 200
            ? `${image}<p>${plainText.substring(0, 150)}...</p>`
            : `${image}<p>${plainText}</p>`;

    // console.log(resumContent)
    return (
        <div
            dangerouslySetInnerHTML={{ __html: resumContent }}
        />
    );
};

export default PostContentResum;
