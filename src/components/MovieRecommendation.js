import { useState, useEffect } from 'react';
import axios from 'axios';

function MovieRecommendations({ username }) {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`/api/user/${username}`);
        const { id, watched_movies } = response.data; 
        const recommendedMovies = await axios.post(`/api/recommendations`, { watched_movies });
setRecommendations(recommendedMovies.data);
} catch (error) {
console.error(error);
}
}
fetchData();
}, [username]);
return (
<div>
<h2>Movie recommendations for {username}</h2>
<ul>
{recommendations.map((movie) => (
<li key={movie.id}>{movie.title}</li>
))}
</ul>
</div>
);
}