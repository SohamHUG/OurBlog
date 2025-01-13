import * as Yup from 'yup';

export const userValidation = Yup.object().shape({
    firstName: Yup.string(),
        // .min(2, 'Le prénom doit contenir au moins 2 caractères'),
    lastName: Yup.string(),
        // .min(2, 'Le nom doit contenir au moins 2 caractères'),
    pseudo: Yup.string()
        .min(2, 'Le pseudo doit contenir au moins 2 caractères')
        .required('Pseudo requis'),
    email: Yup.string()
        .email('Email invalide')
        .required('Email requis'),
    password: Yup.string()
        .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
        .matches(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
        .matches(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
        .required('Mot de passe requis'),
});