export const useClearImage = () => {
  const clearImage = (el_img) => {
    const ele = el_img.current;
    while (ele.firstChild) {
      ele.removeChild(ele.firstChild);
    }
  };

  return { clearImage };
};
