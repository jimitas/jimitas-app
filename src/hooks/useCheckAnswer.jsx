import * as se from "src/components/se";
export const useCheckAnswer = () => {
  const sendRight = async (el_text) => {
    se.right.play();
    el_text.current.innerHTML = `<span style="color:red;">せいかい</span>`;
  };

  const sendWrong = async (el_text) => {
    se.alert.play();
    const pre_text = el_text.current.innerHTML; //前のメッセージを保存
    el_text.current.innerHTML = `<span style="color:gray;">ちがうよ</span>`;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    el_text.current.innerHTML = pre_text; //保存したメッセージを再び表示
  };

  return { sendRight,sendWrong };
};
