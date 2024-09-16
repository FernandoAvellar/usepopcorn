import { useEffect, useRef } from 'react';

/* eslint-disable react/prop-types */
export default function Search({ query, setQuery }) {
  const inputEl = useRef(null);

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
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      autoFocus
      ref={inputEl}
    />
  );
}
