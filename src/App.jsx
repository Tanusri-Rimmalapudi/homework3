import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

function App() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    fetchMovies();
  }, [page, search]);

  const fetchMovies = async () => {
    let url = "";

    if (search) {
      url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${search}&page=${page}`;
    } else {
      url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    setMovies(data.results);
  };

  const sortedMovies = [...movies].sort((a, b) => {
    if (sort === "rating") return b.vote_average - a.vote_average;
    if (sort === "date")
      return new Date(b.release_date) - new Date(a.release_date);
    return 0;
  });

  return (
    <div className="container">
      <h1>Movie Explorer</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search movies..."
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
      />

      {/* Sort */}
      <select onChange={(e) => setSort(e.target.value)}>
        <option value="">Sort</option>
        <option value="rating">Rating</option>
        <option value="date">Release Date</option>
      </select>

      {/* Movies */}
      <div className="grid">
        {sortedMovies.map((movie) => (
          <div className="card" key={movie.id}>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt=""
            />
            <h3>{movie.title}</h3>
            <p>{movie.release_date}</p>
            <p>⭐ {movie.vote_average}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>

        <span>Page {page}</span>

        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}

export default App;
