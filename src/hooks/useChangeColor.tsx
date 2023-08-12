import { useCallback, useEffect, useState } from "react";
import * as se from "src/components/se";
// test
interface ChangeColorResult {
  colorIndex: number;
  changeColor: () => void;
}

export const useChangeColor = (): ChangeColorResult => {
  const styleColor: string[] = ["black","white",  "white", "black", "black", "white"];
  const styleBColor: string[] = ["white", "#008544", "black", "#C2E5F9", "#FFDC00", "#EA5404"];
  const [colorIndex, setColorIndex] = useState<number>(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  const changeColor = useCallback(() => {
    if (isButtonDisabled) return;
    se.set.play();
    setColorIndex((prevColorIndex) => prevColorIndex + 1);
    setIsButtonDisabled(true);
  }, [isButtonDisabled]);

  // 目に負担がかからないために、連打できない設定にする。
  useEffect(() => {
    if (!isButtonDisabled) return;

    const timer = setTimeout(() => {
      setIsButtonDisabled(false);
    }, 500); // ボタンの無効化時間（ミリ秒）

    return () => clearTimeout(timer);
  }, [isButtonDisabled]);

  useEffect(() => {
    document.body.style.color = styleColor[colorIndex % styleColor.length];
    document.body.style.backgroundColor = styleBColor[colorIndex % styleBColor.length];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorIndex]);

  return { colorIndex, changeColor };
};
