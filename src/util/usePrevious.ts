import {useRef, useEffect, MutableRefObject} from 'react';

function usePrevious(value: number) {
  const ref: MutableRefObject<number | undefined> = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export default usePrevious;
