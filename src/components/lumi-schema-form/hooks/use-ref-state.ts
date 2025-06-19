import { useCallback, useRef, useState } from "react";

/**
 * @description 结合Ref和State的自定义Hook，确保可以获取到最新的状态值
 * @param initialValue 初始值
 * @returns [ref对象, 状态值, 设置状态的函数]
 */
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
