import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

const UpdateRole = ({
    user,
    formUser,
    handleChange
}) => {
    const [status, setStatus] = useState('loading');
    const [roles, setRoles] = useState([])

    useEffect(() => {
        const confirmEmail = async () => {

            const response = await fetch(`http://localhost:3000/admin/roles`, {
                method: "GET",
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                setRoles(data.roles);
                setStatus('success');
            } else {
                setStatus('error');
            }

        };

        if (status === 'loading') {
            confirmEmail();
        }

    }, [status]);

    // console.log(roles)

    return (
        <div className='input-label-container'>
            {status === 'loading' && <CircularProgress />}
            <label htmlFor='role'>Role :</label>
            <select id='role' name="role" value={formUser.role} onChange={handleChange} required >
                {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                        {role.name}
                    </option>
                ))}
            </select>

        </div>
    );
};

export default UpdateRole;