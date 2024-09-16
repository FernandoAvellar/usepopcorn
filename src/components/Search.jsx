import { useEffect, useRef } from 'react';
import { useId } from 'react';

/* eslint-disable react/prop-types */
export default function Search({ query, setQuery }) {
  const inputEl = useRef(null);
  const inputId = useId();

  useEffect(
    function () {
      function callBack(e) {
        if (document.activeElement === inputEl.current) return;
        if (e.code === 'Enter' || e.code === 'NumpadEnter') {
          inputEl.current.focus();
          setQuery('');
        }
      }

      document.addEventListener('keydown', callBack);

      return function () {
        document.removeEventListener('keydown', callBack);
      };
    },
    [setQuery]
  );

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      autoFocus
      id={inputId}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}
