import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from 'react-redux';
import store from "./store/index.js";
import ScrollToTop from './components/ScrollToTop/ScrollToTop.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ScrollToTop />
            <Provider store={store} >
                <App />
            </Provider>
        </Router>

    </React.StrictMode>,
)
