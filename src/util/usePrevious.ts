import {useRef, useEffect, MutableRefObject} from 'react';

function usePrevious(value: any) {
  const ref: MutableRefObject<any | undefined> = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export default usePrevious;
