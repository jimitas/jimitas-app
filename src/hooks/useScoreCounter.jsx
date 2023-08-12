// スコアの数に応じてコインを表示1,10,100

import { useCallback, useEffect, useState, useRef } from "react";

export const useScoreCounter = () => {
  const [count, setCount] = useState(0);
  const [isShow, setIsShow] = useState(true);
  const handleClick = useCallback(() => {
    if (count < 10) {
      setCount((prevCount) => prevCount + 1);
    }
  }, [count]);

  const handleDisplay = useCallback(() => {
    setIsShow((prevIsShow) => !prevIsShow);
  }, []);

  return { count, isShow, handleClick, handleDisplay };
};
