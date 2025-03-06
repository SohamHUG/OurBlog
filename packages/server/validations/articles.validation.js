import * as Yup from 'yup';

export const articleValidation = Yup.object().shape({
    title: Yup.string()
        .min(3, 'Le titre doit contenir au moins 3 caractères')
        .required('Le titre est obligatoire'),
    category: Yup.number()
        .integer('Catégorie innvalide')
        .positive('Catégorie innvalide')
        .required('La catégorie est obligatoire'),
});