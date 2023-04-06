import React from "react";
import { Routes, Route } from "react-router-dom";
//import  {Switch}  from "react-router-dom";
import  Header  from "./components/Header";

import "./App.css";
import "./lib/font-awesome/css/all.min.css";

import { GlobalProvider } from "./context/GlobalState";
import TitlePage from "./components/TitlePage";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Watchlist from "./components/Watchlist";
import Watched from "./components/Watched";
import Add from "./components/Add";
import Recommendations from "./components/Recommendations";

function App() {
  return (
    <>
    {/* // <GlobalProvider> */}

    <GlobalProvider>

     
        <Routes>
        <Route path="/Register" element={<Register/>}/>
         <Route path="/login" element={<Login/>} />
          <Route path="/" element ={<TitlePage/>}/>
          <Route path="/Home/*" element ={<Home/>}/>
          <Route path="/Watchlist/:uID/*" element ={<Watchlist/>}/>
          <Route path="/Watched/:uID/*" element ={<Watched/>}/>
          <Route path="/Add/:uID/*" element ={<Add/>}/>
          <Route path="/Recommendations/:uID/*" element ={<Recommendations/>}/>


            
        </Routes>
      
    {/* // </GlobalProvider> */}
    </GlobalProvider>

    </>
  );
}

export default App;




