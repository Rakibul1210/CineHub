import React from 'react'
import Header from './Header'
import { Route, Routes } from 'react-router-dom'
import  Watchlist  from "./Watchlist";
import  Watched from "./Watched"
import  Add  from "./Add";
import Recommendations from './Recommendations';

const Home = () => {
  return (
    <>
    <Header/>
    <Routes>
    <Route path="/watchlist" element ={<Watchlist />}/>
     <Route path="/watched" element ={<Watched />}/>
    <Route path="/add" element ={<Add />}/>
    <Route path="/recommendations" element ={<Recommendations />}/>
    </Routes>

    </>
    
  )
}

export default Home
