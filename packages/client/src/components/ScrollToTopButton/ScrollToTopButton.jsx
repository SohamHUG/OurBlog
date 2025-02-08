import * as React from 'react';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';

const ScrollToTopButton = () => {
    const [showToTop, setShowToTop] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setShowToTop(window.scrollY > 500);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const style = {
        position: 'fixed',
        padding: '.6em',
        bottom: '2%',
        right: '2%'
    }


    return (
        <>
            {showToTop &&
                <button style={style} onClick={scrollToTop}>
                    <KeyboardArrowUpRoundedIcon fontSize='medium' />
                </button>
            }
        </>
    );
};

export default ScrollToTopButton;
