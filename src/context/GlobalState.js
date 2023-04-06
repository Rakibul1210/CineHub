import React, { createContext, useReducer, useEffect } from "react";
import AppReducer from "./AppReducer";
import Axios from 'axios';
import { useParams } from "react-router-dom";

// initial state
const initialState = {
  watchlist: localStorage.getItem("watchlist")
    ? JSON.parse(localStorage.getItem("watchlist"))
    : [],
  watched: localStorage.getItem("watched")
    ? JSON.parse(localStorage.getItem("watched"))
    : [],
};

// create context
export const GlobalContext = createContext(initialState);

// provider components
export const GlobalProvider = (props) => {
  const userID = useParams();
  console.log("userid globalState : " + userID.userID);
  const [state, dispatch] = useReducer(AppReducer, initialState);
  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(state.watchlist));
    localStorage.setItem("watched", JSON.stringify(state.watched));
  }, [state]);

  // actions
  const addMovieToWatchlist = (movie, userID) => {
    Axios.post("http://localhost:5050/addToWatchlist",{
      movie:movie,
      userID:userID
    }).then((response)=>{
        if(response){
            console.log(response);
           
        }
    }).catch((err)=>{
        if(err){
            console.log(err);
        }
    });
    dispatch({ type: "ADD_MOVIE_TO_WATCHLIST", payload: movie });
    
  };

  const removeMovieFromWatchlist = (movie) => {
  
    Axios.post("http://localhost:5050/removeFromWatchlist",{
      userID : userID,
      movie:movie
    }).then((response)=>{
        if(response){
            console.log(response);
           
        }
    }).catch((err)=>{
        if(err){
            console.log(err);
        }
    });
    dispatch({ type: "REMOVE_MOVIE_FROM_WATCHLIST", payload: movie.id });
  };

  const addMovieToWatched = (movie, userID) => {
    Axios.post("http://localhost:5050/addToWatched",{
      movie:movie,
      userID:userID
      
    }).then((response)=>{
        if(response){
            console.log(response);
           
        }
    }).catch((err)=>{
        if(err){
            console.log(err);
        }
    });
    dispatch({ type: "ADD_MOVIE_TO_WATCHED", payload: movie });
  };

  const moveToWatchlist = (movie) => {
    Axios.post("http://localhost:5050/moveToWatchlist",{
      userID : userID,
      movie : movie
    }).then((response)=>{
        if(response){
            console.log(response);
           
           
        }
    }).catch((err)=>{
        if(err){
            console.log(err);
        }
    });
    dispatch({ type: "MOVE_TO_WATCHLIST", payload: movie });
  };

  const removeFromWatched = (id) => {
    Axios.post("http://localhost:5050/removeFromWatched",{
      userID : userID
    }).then((response)=>{
        if(response){
            console.log(response);
           
        }
    }).catch((err)=>{
        if(err){
            console.log(err);
        }
    });
    dispatch({ type: "REMOVE_FROM_WATCHED", payload: id });
  };

  return (
    <GlobalContext.Provider
      value={{
        watchlist: state.watchlist,
        watched: state.watched,
        addMovieToWatchlist,
        removeMovieFromWatchlist,
        addMovieToWatched,
        moveToWatchlist,
        removeFromWatched,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};
