import { useCallback, useState } from "react";

export const useScoreCounter = () => {
  const [count, setCount] = useState(0);
  const [isShow, setIsShow] = useState(true);

  const handleClick = useCallback(() => {
    if (count < 100) {
      setCount((prevCount) => prevCount === 0 ? 1 : prevCount * 10);
    }
  }, [count]);

  const handleDisplay = useCallback(() => {
    setIsShow((prevIsShow) => !prevIsShow);
  }, []);

  return { count, isShow, handleClick, handleDisplay };
};
