import { useRef, useEffect } from "react";

/*
 * detect if browser window is getting closed and do something before
 */

const useUnload = (fn) => {
  // init with fn, so that type checkers won't assume that current might be undefined
  const cb = useRef(fn);

  useEffect(() => {
    cb.current = fn;
  }, [fn]);

  useEffect(() => {
    const onUnload = (...args) => cb.current?.(...args);

    window.addEventListener("beforeunload", onUnload);

    return () => window.removeEventListener("beforeunload", onUnload);
  }, []);
};

export default useUnload;
