import * as Yup from 'yup';

export const articleValidation = Yup.object().shape({
    title: Yup.string().
        min(5, 'Le titre doit contenir au moins 5 caractères')
        .required('Le titre est obligatoire'),
    category: Yup.number()
        .integer('Catégorie innvalide')
        .positive('Catégorie innvalide')
        .required('La catégorie est obligatoire'),
});