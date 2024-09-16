import { useEffect } from 'react';

export function useKey(keyName, actionCallback) {
  useEffect(
    function () {
      function callBack(e) {
        if (e.code.toLowerCase() === keyName.toLowerCase()) {
          actionCallback();
        }
      }

      document.addEventListener('keydown', callBack);

      return function () {
        document.removeEventListener('keydown', callBack);
      };
    },
    [keyName, actionCallback]
  );
}
