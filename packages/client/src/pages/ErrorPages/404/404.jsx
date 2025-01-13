import { NavLink, useLocation } from "react-router-dom";


const ErrPage = () => {

    const style = {
        texteAlign:'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    }

    return (
        <div className="page" style={style}>
            <h1>404</h1>
            <h2 style={{width: 'fit-content', textAlign: 'center'}}>Oups, vous semblez perdus, retournez à <NavLink to={'/'} className={'link'}>l'accueil</NavLink> </h2>

        </div>
    );
};

export default ErrPage;