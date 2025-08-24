import * as se from "src/components/se";
import { Block } from "src/components/Block";
import { Hide } from "src/components/Hide";
import { useState, useRef, useEffect } from "react";
import { BtnNum } from "src/components/PutButton/btnNum";
import { useCheckAnswer } from "src/hooks/useCheckAnswer";
import { PutSelect } from "src/components/PutSelect";
import { PutShiki } from "src/components/PutShiki";
import { PutText } from "src/components/PutText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faQuestion, faUserEdit, faCheck } from "@fortawesome/free-solid-svg-icons";
import Layout from "src/components/Layout";
import { BtnCheck } from "src/components/PutButton/btnCheck";

const NUM_1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const NUM_2 = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const ITEM = ["～10", "10-□", "1□-□", "1□-□=□"];
var left_value: number;
var right_value: number;
var answer: number | string;

export default function Hikizan1() {
  const { sendRight, sendWrong } = useCheckAnswer();
  const el_text = useRef<HTMLDivElement>(null);
  const el_left_input = useRef<HTMLInputElement>(null);
  const el_right_input = useRef<HTMLInputElement>(null);
  const el_answer = useRef<HTMLInputElement>(null);
  const [flag, setFlag] = useState<boolean>(true);
  const [count, setCount] = useState<number>(0);
  const [selectIndex, setSelectIndex] = useState<number>(0);

  // 初期化
  useEffect(() => {
    setFlag(false);
    left_value = 0;
    right_value = 0;
    el_left_input.current!.value = "";
    el_right_input.current!.value = "";
    el_text.current!.innerHTML = "";
    el_answer.current!.value = "";
    el_text.current!.innerHTML = "もんだい　または　セット";
  }, [selectIndex]);

  // 問題の難易度をセレクト
  const changeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    se.reset.play();
    const selectedIndex: number = e.target.selectedIndex;
    setSelectIndex(selectedIndex);
  };

  // 問題を出す
  const giveQuestion = () => {
    se.pi.play();
    setFlag(true);
    el_text.current!.innerHTML = "";
    el_answer.current!.value = "";

    switch (selectIndex) {
      case 0:
        left_value = Math.floor(Math.random() * 10 + 1);
        right_value = Math.floor(Math.random() * left_value + 1);
        break;
      case 1:
        left_value = 10;
        right_value = Math.floor(Math.random() * left_value + 1);
        break;
      case 2:
        left_value = Math.floor(Math.random() * 9 + 11);
        right_value = Math.floor(Math.random() * (left_value - 11));
        break;
      case 3:
        left_value = Math.floor(Math.random() * 9 + 11);
        const ichi = 20 - left_value;
        right_value = Math.floor(Math.random() * ichi + (10 - ichi));
        break;
    }

    answer = left_value - right_value;
    el_left_input.current!.value = left_value.toString();
    el_right_input.current!.value = right_value.toString();
    setCount((count) => count + 1);
  };

  // 問題を自分で入力する。
  const setQuest = () => {
    left_value = Number(el_left_input.current!.value);
    right_value = Number(el_right_input.current!.value);
    el_answer.current!.value = "";
    if (!(el_left_input.current!.value && el_right_input.current!.value)) {
      se.alertSound.play();
      el_text.current!.innerHTML = "しきを　セット　して　ください。";
      setTimeout(() => {
        setFlag(true);
        el_text.current!.innerHTML = "もんだい　または　セット";
        el_left_input.current!.value = "";
        el_right_input.current!.value = "";
      }, 1000);
      return;
    }
    if (left_value > 20 || right_value > left_value || left_value < 0 || right_value < 0) {
      se.alertSound.play();
      alert("すうじは　0～20。ひかれるかず > ひくかず");
      el_left_input.current!.value = "";
      el_right_input.current!.value = "";
      return;
    } else {
      setFlag(true);
      se.pi.play();
      el_text.current!.innerHTML = "";
      answer = Math.floor(left_value - right_value);
    }
    setCount((count) => count + 1);
  };

    //正解をみる
  const showAnswer = () => {
    if (!flag) return;
    se.seikai1.play();
    el_answer.current!.value = parseInt(el_answer.current!.value) == answer ? "" : answer.toString();
  };

  const checkAnswer = (myAnswer: number) => {
    // 回答チェック
    if (!flag) return;
    setFlag(false);
    answer == myAnswer ? sendRight(el_text) : sendWrong(el_text);
    //間違えたら、1秒後に再入力可能に。
    if (answer != myAnswer)
      setTimeout(() => {
        setFlag(true);
      }, 1000);
  };

  // 答えの欄に値を直接入力したときの処理。
  const checkAnswerEvent = () => {
    if (!flag) return;
    const myAnswer = parseInt(el_answer.current!.value);
    if (myAnswer) checkAnswer(myAnswer); //値があればcheckAnswer()を実行
    else {
      se.alertSound.play();
      el_text.current!.innerHTML = "すうじを　おすか、こたえを　いれてから「こたえあわせ」";
      setTimeout(() => {
        el_text.current!.innerHTML = "";
        el_answer.current!.value = "";
      }, 1000);
    }
  };

  return (
    <Layout title="ひきざん１">
      <div className="flex flex-wrap justify-center items-center">
        <PutSelect ITEM={ITEM} handleEvent={changeSelect}></PutSelect>

        <button className="btn" onClick={giveQuestion}>
          <div style={{ display: "flex" }}>
            <FontAwesomeIcon icon={faQuestion} className="w-8 h-8" />
            {"もんだい"}
          </div>
        </button>
        <button className="btn" onClick={setQuest}>
          <div style={{ display: "flex" }}>
            <FontAwesomeIcon icon={faUserEdit} className="w-8 h-8" />
            {"セット"}
          </div>
        </button>
        <button className="btn" onClick={showAnswer}>
          <div style={{ display: "flex" }}>
            <FontAwesomeIcon icon={faEye} className="w-8 h-8" />
            {"こたえをみる"}
          </div>
        </button>
      </div>

      <PutText el_text={el_text}></PutText>

      <div className="flex justify-center items-center">
        <PutShiki
          kigo={"-"}
          el_right_input={el_right_input}
          el_left_input={el_left_input}
          el_answer={el_answer}
        ></PutShiki>
        <BtnCheck handleEvent={checkAnswerEvent} />
      </div>

      <div className="place">
        <Block leftCount={left_value} rightCount={0} />
      </div>

      <BtnNum ITEM={NUM_1} handleEvent={checkAnswer}></BtnNum>

      <BtnNum ITEM={NUM_2} handleEvent={checkAnswer}></BtnNum>

      <Hide />
    </Layout>
  );
}
