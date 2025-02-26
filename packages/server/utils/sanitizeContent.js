import sanitizeHtml from 'sanitize-html';

export const sanitizeContent = (content) => {
    return sanitizeHtml(content, {
        allowedTags: [
            'p', 'h1', 'h2', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'br', 'img', 'blockquote', 'span', 's'
        ],
        allowedAttributes: {
            a: ['href', 'target', 'rel', 'class', 'style'],
            img: ['src', 'alt', 'class', 'style', 'width'],
            span: ['class', 'style'],
            strong: ['class', 'style'],
            p: ['class', 'style'],
            u: ['class', 'style'],
            ul: ['class', 'style'],
            ol: ['class', 'style'],
            s: ['class', 'style'],
            h1: ['class', 'style'],
            h2: ['class', 'style'],
            em: ['class', 'style'],
            li: ['class', 'style', 'data-list'],
            blockquote: ['class', 'style'],
        },
        allowedStyles: {
            '*': {
                // Limiter les styles autorisés
                'color': [/^#([0-9a-f]{3}){1,2}$/i, /^rgb\(/, /^rgba\(/, /^(red)$/i], // Autorise uniquement les couleurs valides
                'font-size': [/^\d+(px|em|rem|%)$/], // Évite les valeurs arbitraires
                'text-align': [/^(left|right|center|justify)$/],
                'font-weight': [/^(normal|bold|lighter|bolder|[1-9]00)$/],
                'text-decoration': [/^(none|underline|line-through|overline)$/],
            }
        },
        disallowedTagsMode: 'discard',
    })
}