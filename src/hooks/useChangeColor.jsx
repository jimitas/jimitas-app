import { useCallback, useState } from "react";
import * as se from "src/components/se";

export const useChangeColor = () => {
  const styleColor = ["white", "black", "white", "black", "black", "white"];
  const styleBColor = ["#008544", "white", "black", "#C2E5F9", "#FFDC00", "#EA5404"];
  const [colorIndex, setColorIndex] = useState(0);

  const changeColor = useCallback(() => {
    se.set.play();
    const result = window.confirm("いろを　かえますか？");
    //連打して、目に負担がかからないためにも、このメッセージを表示させる。
    if (result === false) return;
    setColorIndex((prevColorIndex) => prevColorIndex + 1);
    document.body.style.color = styleColor[colorIndex % styleColor.length];
    document.body.style.backgroundColor = styleBColor[colorIndex % styleBColor.length];
  });

  return { colorIndex, changeColor };
};
