import { useState } from 'react'
import reactLogo from './assets/react.svg'

import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser } from "react-admin";
// import jsonServerProvider from "ra-data-json-server";
import crudProvider from 'ra-data-nestjsx-crud'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css'
import { OlimpiadCreate, OlimpiadEdit, OlimpiadList, OlimpiadShow } from './Olimpiads';
import { HostList } from './hosts';
import { ClassCreate, ClassEdit, ClassList, ClassShow } from './classes';
import { ProfileCreate, ProfileEdit, ProfileList, ProfileShow } from './profiles';
import { EventList } from './events';
import { MajorCreate, MajorEdit, MajorShow, MajorsList } from './major';
import { BonusTypeCreate, BonusTypeEdit, BonusTypeList, BonusTypeShow } from './bonusType';

// const dataProvider = jsonServerProvider('http://localhost:3000')
const dataProvider = crudProvider('http://localhost:3000');
// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <div className="App">
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src="/vite.svg" className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://reactjs.org" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </div>
//   )
// }

const App = () => (
  // <BrowserRouter> 
    <Admin basename='/admin' dataProvider={dataProvider}>
      <Resource name="olimpiads" options={{ label: "Олимпиады" }} list={OlimpiadList} recordRepresentation = "name" edit={OlimpiadEdit} show={OlimpiadShow} create={OlimpiadCreate}/>
      <Resource name="classes" options={{ label: "Предметы" }} list={ClassList} recordRepresentation="name" edit={ClassEdit} show={ClassShow} create={ClassCreate}/>
      <Resource name="profiles" options={{ label: "Профили" }} list={ProfileList} recordRepresentation="name" edit={ProfileEdit} show={ProfileShow} create={ProfileCreate}/>
      <Resource name="majors" options={{ label: "Специальности ВУЗ" }} recordRepresentation="name" list={MajorsList} edit={MajorEdit} show={MajorShow} create={MajorCreate}/>
      <Resource name="hosts" options={{ label: "Организаторы" }} list={HostList} recordRepresentation = "name" edit={EditGuesser} show={ShowGuesser}/>
      <Resource name="events" options={{ label: "События" }}  list={EventList} recordRepresentation = "name" edit={EditGuesser} show={ShowGuesser}/>
      <Resource name="bonusType" options={{ label: "Типы преимуществ" }} recordRepresentation = "name" list={BonusTypeList} edit={BonusTypeEdit} show={BonusTypeShow} create={BonusTypeCreate}/>
      <Resource name="hostBonus" options={{ label: "Преимущества при поступлении" }} recordRepresentation = "name" list={ListGuesser} edit={EditGuesser} show={ShowGuesser}/>
    </Admin>
  // </BrowserRouter>
  )

export default App
