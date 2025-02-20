import React, { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../Modal/Modal";
import { deleteComment } from "../../store/slice/commentSlice";
import { NavLink, useLocation } from "react-router-dom";

const CommentsList = ({ comments }) => {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const location = useLocation()
    const [openModalConfirm, setOpenModalConfirm] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);

    const toggleModalConfirm = (id) => {
        setCommentToDelete(id);
        setOpenModalConfirm(true);
    };

    const closeModalConfirm = () => {
        setCommentToDelete(null);
        setOpenModalConfirm(false);
    };

    const confirmDeleteComment = async () => {
        if (commentToDelete) {
            dispatch(deleteComment(commentToDelete));
            closeModalConfirm();
        }
    };

    return (
        <div>
            {comments && comments.length > 0 ? (
                comments.map((comm) => (
                    <div key={comm.id}>
                        <div>
                            {!comm.user_picture ? (
                                <AccountCircleIcon className='default-avatar' fontSize="large" />
                            ) : (
                                <img className="avatar" src={comm.user_picture} alt={`Photo de profil de ${comm.user_pseudo}`} />
                            )}
                            {comm.user_pseudo}
                        </div>
                        <p>{comm.content}</p>
                        {(location.pathname.startsWith('/admin/user') || location.pathname.startsWith('/profil')) &&
                            <NavLink className='link' to={`/article/${comm.article_id}`}>
                                Voir l'article
                            </NavLink>
                        }

                        {user &&
                            (user.user_id === comm.user_id ||
                                user.role_name === 'admin' ||
                                user.role_name === 'moderator') && (
                                <>
                                    <button onClick={() => toggleModalConfirm(comm.id)}>
                                        <span>Supprimer</span>
                                    </button>
                                </>
                            )}

                    </div>
                ))
            ) : (
                <p>Aucun commentaire pour le moment.</p>
            )}

            {openModalConfirm && (
                <Modal
                    title="Êtes-vous sûr ?"
                    content={
                        <div>
                            <p>Voulez-vous vraiment <strong style={{ color: 'red' }}>supprimer</strong> ce commentaire de manière <strong style={{ color: 'red' }}>définitive</strong> ?</p>
                            <strong style={{ color: 'red' }}>Cette action est irréversible !</strong>
                        </div>
                    }
                    validButton='Oui, je suis sûr'
                    cancelButton='Annuler'
                    open={openModalConfirm}
                    cancel={closeModalConfirm}
                    valid={confirmDeleteComment}
                />
            )}
        </div>
    );
};

export default CommentsList;
