import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(

    <BrowserRouter>
    <App />
    <ToastContainer />
    </BrowserRouter>

)
