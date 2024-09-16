/* eslint-disable react/prop-types */
import { useRef, useId } from 'react';
import { useKey } from '../hooks/useKey';

export default function Search({ query, setQuery }) {
  const inputEl = useRef(null);
  const inputId = useId();

  function handleEnterKeyPressed() {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery('');
  }

  useKey('Enter', handleEnterKeyPressed);
  useKey('NumpadEnter', handleEnterKeyPressed);

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
