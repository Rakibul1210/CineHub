import React from "react";
import { Link, useParams } from "react-router-dom";

const Header = () => {
  const uID = useParams();
  console.log(`/Watched/${uID.uID}`);
  return (
    <header>
      <div className="container">
        <div className="inner-content">
          <div className="brand">
            <Link to="/">CineHub</Link>
          </div>

          <ul className="nav-links">
            <li>
              <Link to={`/Watchlist/${uID.uID}`}>Watchlist</Link>
            </li>

            <li>
              <Link to={`/Watched/${uID.uID}`}>Watched</Link>
            </li>
            <li>
              <Link to="/recommendations" className="btn btn-warning">
                Recommendations
              </Link>
            </li>

            <li>
              <Link to={`/Add/${uID.uID}`} className="btn btn-success">
                + Add
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};


export default Header;