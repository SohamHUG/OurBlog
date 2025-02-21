import React from 'react';
import DOMPurify from 'dompurify';

const PostContentResum = ({ content }) => {
    // Nettoyage du contenu HTML
    const sanitizedContent = DOMPurify.sanitize(content);

    // console.log(sanitizedContent)

    // Extraction du texte brut en excluant les balises HTML
    const plainText = sanitizedContent.replace(/<[^>]+>/g, ' ');
    // const plainText = sanitizedContent.replace(/<(?!\/?(ul|ol|li)\b)[^>]*>/gi, '');

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

    // console.log(plainText)


    // image par défaut si l'article n'en a pas 
    if (!imageFound) {
        // image = `<img src="https://res.cloudinary.com/dni6ctpie/image/upload/v1737720475/files/xawevym4ryigg3oufwoh.png" alt="Default" />`;
        image = `<img src="/img/default-article.png" alt="image d'article par défaut" />`;
    }

    // réduis le contenu 
    const resumContent =
        plainText.length > 200
            ? `${image}<p>${plainText.trim().substring(0, 500)}...</p>`
            : `${image}<p>${plainText.trim()}</p>`;

    // console.log(resumContent)
    return (
        <div
            dangerouslySetInnerHTML={{ __html: resumContent }}
        />
    );
};

export default PostContentResum;
