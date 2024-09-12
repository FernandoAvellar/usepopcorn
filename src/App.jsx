import { useEffect, useState } from 'react';
import StarRating from './StarRating';

const average = (arr) => {
  const validValues = arr.filter((value) => !isNaN(value));
  return validValues.reduce((acc, cur) => acc + cur, 0) / validValues.length;
};

const OMDB_API_KEY = '91a2b660';

export default function App() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError('');
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${query}`
        );

        if (!res.ok) throw new Error('Failed to fetch movies');

        const data = await res.json();
        if (data.Response === 'False') throw new Error('Movie not found');

        setMovies(data.Search);
      } catch (err) {
        console.error(err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    if (query.length < 3) {
      setMovies([]);
      setError('');
      return;
    }
    fetchMovies();
  }, [query]);

  function handleSelectMovie(movieId) {
    setSelected(movieId === selected ? null : movieId);
  }

  function handleCloseMovie() {
    setSelected(null);
  }

  function handleAddMovieToWatchedList(newWatched) {
    setWatched([...watched, newWatched]);
  }

  function handleDeleteMovieFromWatchedList(id) {
    setWatched(watched.filter((watched) => watched.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selected ? (
            <MovieDetails
              selectId={selected}
              onCloseMovie={handleCloseMovie}
              onAddMovieToWatchedList={handleAddMovieToWatchedList}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDelete={handleDeleteMovieFromWatchedList}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies ? movies.length : 0}</strong> results
    </p>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? '–' : '+'}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie key={movie.imdbID} movie={movie} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({ selectId, onCloseMovie, onAddMovieToWatchedList }) {
  const [poster, setPoster] = useState('');
  const [title, setTitle] = useState('');
  const [released, setReleased] = useState('');
  const [runtime, setRuntime] = useState('');
  const [genre, setGenre] = useState('');
  const [imdbRating, setImdbRating] = useState('');
  const [plot, setPlot] = useState('');
  const [actors, setActors] = useState('');
  const [director, setDirector] = useState('');
  const [userRating, setUserRating] = useState('');

  useEffect(
    function () {
      async function fetchMovieDetail(selectId) {
        try {
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${selectId}`
          );

          if (!res.ok) throw new Error('Failed to fetch movie detail');

          const data = await res.json();

          setPoster(data.Poster);
          setTitle(data.Title);
          setReleased(data.Released);
          setRuntime(data.Runtime.split(' ')[0]);
          setGenre(data.Genre);
          setImdbRating(data.Ratings[0].Value.split('/')[0]);
          setPlot(data.Plot);
          setActors(data.Actors);
          setDirector(data.Director);
        } catch (err) {
          console.error(err.message);
        }
      }
      fetchMovieDetail(selectId);
    },
    [selectId]
  );

  function handleRating(rating) {
    setUserRating(rating);
  }

  function handleAddToList() {
    const watchedMovie = {
      imdbID: selectId,
      title,
      imdbRating: Number(imdbRating),
      poster,
      userRating: Number(userRating),
      runtime: Number(runtime),
    };
    onAddMovieToWatchedList(watchedMovie);
    onCloseMovie();
  }

  return (
    <div className="details">
      <header className="header">
        <button className="btn-back" onClick={onCloseMovie}>
          &larr;
        </button>
        <img src={poster} alt={`${title} poster`} />
        <div className="details-overview">
          <h2> {title} </h2>
          <p>
            {released} • {runtime} min
          </p>
          <p>{genre}</p>
          <p>⭐{imdbRating} IMDb rating</p>
        </div>
      </header>
      <section>
        <div className="rating">
          <StarRating
            onSettingRating={(rating) => handleRating(rating)}
            maxRating={10}
            color="#fcc419"
            size={18}
          />
          {userRating > 0 && (
            <button className="btn-add" onClick={handleAddToList}>
              + Add to list
            </button>
          )}
        </div>
        <p>{plot}</p>
        <p>Starring {actors}</p>
        <p>Directed by {director}</p>
      </section>
    </div>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{Math.round(avgImdbRating)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{Math.round(avgUserRating)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{Math.round(avgRuntime)} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({ watched, onDelete }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie key={movie.imdbID} movie={movie} onDelete={onDelete} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDelete }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button className="btn-delete" onClick={() => onDelete(movie.imdbID)}>
          X
        </button>
      </div>
    </li>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span>
      {message}
    </p>
  );
}
