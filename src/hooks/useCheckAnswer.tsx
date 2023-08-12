import * as se from "src/components/se";
import { RefObject } from "react";

export const useCheckAnswer = () => {
  const sendRight = async (el_text: RefObject<HTMLDivElement>) => {
    se.right.play();
    if (el_text.current) {
      el_text.current.innerHTML = `<span style="color:red;">せいかい</span>`;
    }
  };

  const sendWrong = async (el_text: RefObject<HTMLDivElement>) => {
    se.alertSound.play();
    if (el_text.current) {
      const pre_text = el_text.current.innerHTML;
      el_text.current.innerHTML = `<span style="color:gray;">ちがうよ</span>`;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      el_text.current.innerHTML = pre_text;
    }
  };

  return { sendRight, sendWrong };
};
