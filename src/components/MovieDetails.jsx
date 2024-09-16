/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from 'react';
import Loader from './Loader';
import StarRating from './StarRating';

const apiKey = '91a2b660';

export default function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddMovieToWatchedList,
  watched,
}) {
  const [movie, setMovie] = useState([]);
  const [userRating, setUserRating] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    Title: title,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  const isAlreadyWatched = watched.some((m) => m.imdbID === movie.imdbID);
  const watchedUserRating = watched.find(
    (m) => m.imdbID === selectedId
  )?.userRating;

  const handleClose = useCallback(() => {
    onCloseMovie();
    setUserRating('');
  }, [onCloseMovie]);

  useEffect(
    function () {
      function callBack(e) {
        if (e.code === 'Escape') {
          handleClose();
        }
      }

      document.addEventListener('keydown', callBack);

      return function () {
        document.removeEventListener('keydown', callBack);
      };
    },
    [handleClose]
  );

  useEffect(
    function () {
      async function fetchMovieDetails(selectedId) {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${apiKey}&i=${selectedId}`
        );

        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      fetchMovieDetails(selectedId);
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return () => (document.title = 'usePopcorn');
    },
    [title]
  );

  function handleAddToList() {
    const watchedMovie = {
      imdbID: selectedId,
      title,
      imdbRating: Number(imdbRating),
      poster,
      userRating: Number(userRating),
      runtime: Number(runtime.split(' ').at(0)),
    };
    onAddMovieToWatchedList(watchedMovie);
    onCloseMovie();
    setUserRating('');
  }

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header className="header">
            <button className="btn-back" onClick={handleClose}>
              &larr;
            </button>
            <img src={poster} alt={`${title} poster`} />
            <div className="details-overview">
              <h2> {title} </h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {isAlreadyWatched ? (
                <p>
                  You have rated this movie {watchedUserRating} <span>⭐</span>
                </p>
              ) : (
                <StarRating
                  onSettingRating={(rating) => setUserRating(rating)}
                  maxRating={10}
                  color="#fcc419"
                  size={18}
                />
              )}
              {userRating > 0 && (
                <button className="btn-add" onClick={handleAddToList}>
                  + Add to list
                </button>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
