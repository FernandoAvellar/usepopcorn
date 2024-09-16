import { useEffect, useState, useCallback } from 'react';
import { useMovies } from './hooks/useMovies';
import NavBar from './components/NavBar';
import Search from './components/Search';
import NumResults from './components/NumResults';
import Main from './components/Main';
import Box from './components/Box';
import MovieList from './components/MovieList';
import MovieDetails from './components/MovieDetails';
import WatchedSummary from './components/WatchedSummary';
import WatchedMoviesList from './components/WatchedMoviesList';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';

export default function App() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const handleCloseMovie = useCallback(() => setSelected(null), []);
  const { movies, isLoading, error } = useMovies(query, handleCloseMovie);
  const [watched, setWatched] = useState(function () {
    const storedValue = JSON.parse(localStorage.getItem('watchedMovies'));
    return storedValue ? storedValue : [];
  });

  function handleSelectMovie(movieId) {
    setSelected(movieId === selected ? null : movieId);
  }

  function handleAddMovieToWatchedList(newWatched) {
    setWatched((watched) => [...watched, newWatched]);
  }

  function handleDeleteMovieFromWatchedList(id) {
    setWatched(watched.filter((watched) => watched.imdbID !== id));
  }

  useEffect(
    function () {
      localStorage.setItem('watchedMovies', JSON.stringify(watched));
    },
    [watched]
  );

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
              selectedId={selected}
              onCloseMovie={handleCloseMovie}
              onAddMovieToWatchedList={handleAddMovieToWatchedList}
              watched={watched}
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
