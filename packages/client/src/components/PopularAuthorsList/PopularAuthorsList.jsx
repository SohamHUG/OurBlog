// import * as React from 'react';
// import * as Redux from 'react-redux';
// import { selectUsersStatus, selectUsersError, selectUsers, } from '../../store/selectors';
// import { searchUsers, } from '../../store/slice/userSlice';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import './PopularAuthorsList.scss'

// const PopularAuthorsList = () => {
//     const [visibleItemsCount, setVisibleItemsCount] = React.useState(5);
//     const [showMore, setShowMore] = React.useState(false);

//     const dispatch = Redux.useDispatch();
//     const status = Redux.useSelector(selectUsersStatus);
//     const error = Redux.useSelector(selectUsersError);
//     const users = Redux.useSelector(selectUsers);

//     React.useEffect(() => {
//         if (status === 'idle') {
//             dispatch(searchUsers());
//         }
//     }, [status, dispatch]);

//     const handleSeeMore = () => {
//         if (!showMore) {
//             setVisibleItemsCount((prevCount) => prevCount + visibleItemsCount);
//             setShowMore(true);
//         } else if (showMore) {
//             setVisibleItemsCount((prevCount) => prevCount - 5);
//             setShowMore(false);
//         }

//     };

//     return (
//         <>
//             {status === 'loading' &&
//                 <div>Loading</div>
//             }

//             {status === 'failed' &&
//                 <div>{error}</div>
//             }

//             {status === 'succeeded' &&
//                 <div className='popular-users'>
//                     {/* <h3>{title}</h3> */}
//                     {users.slice(0, visibleItemsCount).map((user) => (
//                         <div key={user.id} className='user'>
//                             <AccountCircleIcon/>
//                             {user.name}
//                         </div>
//                     ))}

//                     <button className="see-more-button" onClick={handleSeeMore}>
//                         {showMore
//                             ? 'Voir moins'
//                             : 'Voir plus'
//                         }
//                     </button>

//                 </div>
//             }


//         </>
//     )
// }

// export default PopularAuthorsList;