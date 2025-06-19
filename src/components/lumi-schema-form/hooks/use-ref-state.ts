import { useCallback, useRef, useState } from "react";

export const useRefState = <T>(
  initialValue: T
): [React.RefObject<T>, T, (value: T | ((prev: T) => T)) => void] => {
  const [state, setState] = useState(initialValue);
  const stateRef = useRef(initialValue);

  const setRefState = useCallback((value: T | ((prev: T) => T)) => {
    const newValue =
      typeof value === "function"
        ? (value as (prev: T) => T)(stateRef.current)
        : value;

    stateRef.current = newValue;
    setState(newValue);
  }, []);

  return [stateRef, state, setRefState];
};
