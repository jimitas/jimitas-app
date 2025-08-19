import { RefObject } from "react";

export const useClearImage = () => {
  const clearImage = (el_img: RefObject<HTMLImageElement>) => {
    if (el_img.current) {
      while (el_img.current.firstChild) {
        el_img.current.removeChild(el_img.current.firstChild);
      }
    }
  };

  return { clearImage };
};
