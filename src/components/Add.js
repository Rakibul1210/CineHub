import React, { useState } from "react";
import { ResultCard } from "./ResultCard";
import Header from "./Header";
import { useLocation } from 'react-router-dom';
import { useParams } from "react-router-dom";

const Add = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  //const location = useLocation();
  const userID = useParams();
  const uID = userID.uID;
  console.log("add UID :" + userID.uID);

  const onChange = (e) => {
    e.preventDefault();

    setQuery(e.target.value);

    fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=XXXXXXXXXXXXXX&language=en-US&page=1&include_adult=false&&query=${e.target.value}`
    ).then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error('Network response was not ok');
      }
    })
    .then((data) => {
      if (data.results && data.results.length > 0) {
        setResults(data.results);
      } else {
        setResults([]);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
  return (
    <>
    <Header/>
    <div className="add-page">
      <div className="container">
        <div className="add-content">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Search for a movie"
              value={query}
              onChange={onChange}
            />
          </div>
        
          {results.length > 0 && (
            <ul className="results">
              {results.map((movie) => (
                <li key={movie.id}>
                  <ResultCard movie={movie} userID = {userID} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Add;

