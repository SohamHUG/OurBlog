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
            <h1>403</h1>
            <h2 style={{width: 'fit-content', textAlign: 'center'}}>Vous n'êtes pas autorisé, retournez à <NavLink to={'/'} className={'link'}>l'accueil</NavLink> </h2>

        </div>
    );
};

export default ErrPage;