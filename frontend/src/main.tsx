import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import About from './About'

import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MyResponsiveCalendarCanvas from './Calendar';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/admin/*' element={<App/>}/>
        <Route path='/' element={<MyResponsiveCalendarCanvas/>}/>
        <Route path='/about' element={<About/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
