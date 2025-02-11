import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import { Outlet } from "react-router-dom";
import { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { selectDarkMode } from "../../store/selectors/index";
import ScrollToTopButton from "../ScrollToTopButton/ScrollToTopButton";

const MainTemplate = () => {

    const darkMode = useSelector(selectDarkMode);

    useEffect(() => {

        if (darkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');

        }
    }, [darkMode]);
    
    return (
        <>
            <NavBar />
            <main>
                <Outlet />
                <ScrollToTopButton />
            </main>
            <Footer />
        </>
    )
}

export default MainTemplate