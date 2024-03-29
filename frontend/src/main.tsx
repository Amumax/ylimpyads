import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import About from './components/About'

import './index.css'
import {BrowserRouter, HashRouter, Routes, Route} from 'react-router-dom';
import MyResponsiveCalendarCanvas from './components/Calendar';
import Login from "./components/Login";
import Profile from "./components/Profile";
import Help from "./components/Help";
import Register from "./components/Register";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import OlimpiadList from "./components/List";
import Rules from "./components/Rules";
import Usage from "./components/Usage";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <HashRouter>
            <Routes>
                <Route path='admin/*' element={<App/>}/>
                <Route path='schedule' element={<MyResponsiveCalendarCanvas/>}/>
                <Route path='about' element={<About/>}/>
                <Route path='login' element={<Login/>}/>
                <Route path="profile" element={<Profile/>}/>
                <Route path="help" element={<Help/>}/>
                <Route path="register" element={<Register/>}/>
                <Route path="list" element={<OlimpiadList/>}/>
                <Route path="rules" element={<Rules/>}/>
                <Route path="usage" element={<Usage/>}/>
                <Route path="/" element={<Home/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </HashRouter>
    </React.StrictMode>,
)
