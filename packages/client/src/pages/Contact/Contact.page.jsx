import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { sendContact, setErrorMessage } from "../../store/slice/authSlice";
import Modal from "../../components/Modal/Modal";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import { selectAuthError, selectAuthStatus } from "../../store/selectors";

const ContactPage = () => {
    const status = useSelector(selectAuthStatus)
    const error = useSelector((selectAuthError))
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [openModal, setOpenModal] = useState(false);
    const [formContact, setFormContact] = useState({
        email: '',
        subject: '',
        message: ''
    })

    useEffect(() => {
        dispatch(setErrorMessage(null))
    }, [])

    const handleChange = (e) => {
        setFormContact({ ...formContact, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formContact.email.trim('') || !formContact.subject.trim('') || !formContact.message.trim('')) {
            dispatch(setErrorMessage("Tous les champs sont requis."))
            return;
        }

        try {
            await dispatch(sendContact(formContact)).unwrap();
            setOpenModal(true)
        } catch (error) {
            console.error(error.message)
        }

    }

    const closeModal = () => {
        setOpenModal(false);
        navigate('/');
    }

    return (
        <section>
            <h2>Nous contacter</h2>
            {error && <p className="alert">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Entrez votre adresse mail* :</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="on"
                    value={formContact.email}
                    onChange={handleChange}
                />

                <label htmlFor="subject">Objet de votre message* :</label>
                <input
                    type="text"
                    name="subject"
                    id="subject"
                    autoComplete="off"
                    value={formContact.subject}
                    onChange={handleChange}
                />

                <label htmlFor="message">Votre message* :</label>
                <textarea
                    name="message"
                    id="message"
                    value={formContact.message}
                    onChange={handleChange}
                />
                {status === 'loading' &&
                    <CircularProgress />
                }
                <button type="submit">Envoyer</button>
            </form>
            {openModal &&
                <Modal
                    title="Message envoyé !"
                    content={
                        <p>Votre message a bien été envoyé.</p>
                    }
                    validButton='Ok'
                    open={openModal}
                    cancel={closeModal}
                    valid={closeModal}
                />
            }
        </section>

    )
}

export default ContactPage;