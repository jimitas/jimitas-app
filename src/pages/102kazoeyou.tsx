import * as se from "src/components/se";
import { useEffect, useState, useRef } from "react";
import { PutSelect } from "src/components/PutSelect";
import { BtnNum } from "src/components/PutButton/btnNum";
import { BtnQuestion } from "src/components/PutButton/btnQuestion";
import { useCheckAnswer } from "src/hooks/useCheckAnswer";
import { useClearImage } from "src/hooks/useClearImage";
import { PutImage } from "src/components/PutImage";
import { PutText } from "src/components/PutText";
import Layout from "@/components/Layout";

const ITEM: number[] = [5, 6, 7, 8, 9, 10];
const NUM: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const ANIMALS: string[] = ["apple", "banana", "cat", "monkey", "frog", "dog"];

export default function Home() {
  const { sendRight, sendWrong } = useCheckAnswer();
  const { clearImage } = useClearImage();

  const el_text = useRef<HTMLDivElement>(null);
  const el_img = useRef<HTMLImageElement>(null);
  const [flag, setFlag] = useState(true);
  const [count, setCount] = useState(0);
  const [maxValue, setMaxValue] = useState(5);
  const [answer, setAnswer] = useState(Math.floor(Math.random() * maxValue + 1));

  useEffect(() => {
    setFlag(true);
    clearImage(el_img); // 画像のクリア
    putImage(answer, maxValue); // 画像の配置
    el_text.current!.innerHTML = `<span style="color:none;">いくつかな?</span>`;
  }, [count]);

  const giveQuestion = () => {
    setCount((count) => count + 1);
    setAnswer(Math.floor(Math.random() * maxValue + 1)); // 答えの決定
    se.set.play();
  };

  // 〇〇までの数のセレクトを変える。
  const changeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMaxValue(parseInt(e.target.value));
    giveQuestion();
  };

  // 解答チェック
  const checkAnswer = (num: number) => {
    if (!flag) return;
    setFlag(false);
    const myAnswer = num;
    if (answer == myAnswer) sendRight(el_text);
    else {
      sendWrong(el_text);
      setTimeout(() => {
        setFlag(true);
      }, 1000); //間違えたら、1秒後に再入力可能に。
    }
  };

  // 画像の配置
  const putImage = (answer: number, maxValue: number) => {
    const imgSrc = `images/${ANIMALS[maxValue - 5]}.png`;

    for (let i = 0; i < answer; i++) {
      const div = document.createElement("div");
      const img = document.createElement("img");
      img.setAttribute("src", imgSrc);
      div.appendChild(img);
      el_img.current!.appendChild(div);
    }
  };

  return (
    <div>
      <Layout title="かぞえよう">
        <div className="flex flex-wrap items-end justify-center">
          <PutSelect ITEM={ITEM} handleEvent={changeSelect}></PutSelect>
          <div style={{ fontSize: "max(2vw,20px)" }}>までのかず</div>
        </div>
        <PutText el_text={el_text}></PutText>
        <PutImage el_img={el_img}></PutImage>
        <BtnNum ITEM={NUM} handleEvent={checkAnswer}></BtnNum>
        <BtnQuestion handleEvent={giveQuestion}></BtnQuestion>
      </Layout>
    </div>
  );
}
