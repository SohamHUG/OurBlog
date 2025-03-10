import * as React from 'react';
import * as Redux from 'react-redux';
import { getAllUsers, resetUsers } from '../../store/slice/userSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { selectUsersList, selectUsersStatus } from '../../store/selectors';

const UsersList = () => {
    const dispatch = Redux.useDispatch();
    const users = Redux.useSelector(selectUsersList);
    const status = Redux.useSelector(selectUsersStatus);
    const navigate = useNavigate();

    React.useEffect(() => {
        dispatch(resetUsers())
        dispatch(getAllUsers())
    }, [dispatch]);

    // console.log(users)

    const onClickRow = (id) => {
        // console.log(id)
        navigate(`/admin/user/${id}`)
    }


    return (
        <section className="page-admin">
            {status === 'succeeded' &&
                <>
                    <div className='header-page'>
                        <ArrowBackIcon className="back-btn link" onClick={() => navigate(-1)} />
                        <h2>Les utilisateurs :</h2>
                    </div>
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Avatar</th>
                                <th>Pseudo</th>
                                <th>Nom</th>
                                <th>Rôle</th>
                                <th>Vérifié</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr onClick={() => onClickRow(user.user_id)} key={user.user_id} className="clickable-row">
                                    <td className="avatar-container">

                                        {user.profil_picture ? (
                                            <img className="avatar" src={user.profil_picture} alt="" />
                                        ) : (
                                            <AccountCircleIcon className="default-avatar" fontSize="large" />
                                        )}
                                    </td>
                                    <td>
                                        {user.pseudo}
                                    </td>
                                    <td>
                                        {user.first_name} {user.last_name}
                                    </td>
                                    <td>
                                        {user.role_name}
                                    </td>
                                    <td>
                                        {user.is_verified === 1 ? (
                                            <span className="check-icon">
                                                <CheckCircleIcon />
                                            </span>
                                        ) : (
                                            <span className="cancel-icon">
                                                <CancelIcon />
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            }

        </section>
    );
};

export default UsersList;