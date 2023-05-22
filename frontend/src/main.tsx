import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import About from './components/About'

import './index.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import MyResponsiveCalendarCanvas from './components/Calendar';
import Login from "./components/Login";
import Profile from "./components/Profile";
import Help from "./components/Help";
import Register from "./components/Register";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import OlimpiadList from "./components/List";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path='admin/*' element={<App/>}/>
                <Route path='schedule' element={<MyResponsiveCalendarCanvas/>}/>
                <Route path='about' element={<About/>}/>
                <Route path='login' element={<Login/>}/>
                <Route path="profile" element={<Profile/>}/>
                <Route path="help" element={<Help/>}/>
                <Route path="register" element={<Register/>}/>
                <Route path="list" element={<OlimpiadList/>}/>
                <Route path="/" element={<Home/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
)
