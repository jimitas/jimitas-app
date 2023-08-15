import * as se from "src/components/se";
import styles from "../styles/Home.module.css";
import { Block } from "src/components/Block";
import { useState, useRef, useEffect } from "react";
import { BtnNum } from "src/components/PutButton/btnNum";
import { useCheckAnswer } from "src/hooks/useCheckAnswer";
import { PutSelect } from "src/components/PutSelect";
import { PutShiki } from "src/components/PutShiki";
import { PutText } from "src/components/PutText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faQuestion, faUserEdit, faCheck } from "@fortawesome/free-solid-svg-icons";
import { BtnCheck } from "@/components/PutButton/btnCheck";
import Layout from "@/components/Layout";

const NUM_1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const NUM_2 = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const ITEM = ["10までの　かず", "10+□,□+10", "1□+□,□+1□", "20までの　かず"];
var allowAnswerFlag = false;
var leftCountValue: number = 0;
var rightCountValue: number = 0;
var answer: number;

export default function Tashizan1() {
  const { sendRight, sendWrong } = useCheckAnswer();
  const el_text = useRef<HTMLDivElement>(null);
  const el_left_input = useRef<HTMLInputElement>(null);
  const el_right_input = useRef<HTMLInputElement>(null);
  const el_answer = useRef<HTMLInputElement>(null);
  const [count, setCount] = useState<number>(0);
  const [selectIndex, setSelectIndex] = useState<number>(0);

  // 初期化
  useEffect(() => {
    allowAnswerFlag = false;
    leftCountValue = 0;
    rightCountValue = 0;
    el_left_input.current!.value = "";
    el_right_input.current!.value = "";
    el_text.current!.innerHTML = "";
    el_answer.current!.value = "";
    el_text.current!.innerHTML = "もんだい　または　セット";
  }, [count, selectIndex]);

  // 問題の難易度をセレクト
  const changeSelect = (e: any) => {
    se.reset.play();
    const selectedIndex: number = e.target.selectedIndex;
    setSelectIndex(selectedIndex);
  };

  // 問題を出す
  const giveQuestion = () => {
    se.pi.play();
    allowAnswerFlag = true;
    el_text.current!.innerHTML = "";
    el_answer.current!.value = "";

    const mode = Math.floor(Math.random() * 2 + 1);
    switch (selectIndex) {
      case 0:
        answer = Math.floor(Math.random() * 10 + 1);
        leftCountValue = Math.floor(Math.random() * (answer + 1));
        rightCountValue = answer - leftCountValue;
        break;
      case 1:
        answer = Math.floor(Math.random() * 10 + 11);
        if (mode === 1) {
          leftCountValue = 10;
          rightCountValue = answer - leftCountValue;
        } else if (mode === 2) {
          rightCountValue = 10;
          leftCountValue = answer - rightCountValue;
        }
        break;
      case 2:
        answer = Math.floor(Math.random() * 9 + 12);
        if (mode === 1) {
          leftCountValue = Math.floor(Math.random() * (answer - 11) + 1);
          rightCountValue = answer - leftCountValue;
        } else if (mode === 2) {
          rightCountValue = Math.floor(Math.random() * (answer - 11) + 1);
          leftCountValue = answer - rightCountValue;
        }
        break;
      case 3:
        leftCountValue = Math.floor(Math.random() * 9 + 2);
        rightCountValue = Math.floor(Math.random() * leftCountValue + (10 - leftCountValue) + 1);
        answer = leftCountValue + rightCountValue;
        break;
    }

    el_left_input.current!.value = leftCountValue.toString();
    el_right_input.current!.value = rightCountValue.toString();
    setCount((count) => count + 1);
  };

  // 問題を自分で入力する
  const setQuest = () => {
    leftCountValue = Number(el_left_input.current!.value);
    rightCountValue = Number(el_right_input.current!.value);
    if (leftCountValue > 20 || rightCountValue > 20 || leftCountValue < 0 || rightCountValue < 0) {
      se.alertSound.play();
      alert("すうじは　0～20");
      el_left_input.current!.value = "";
      el_right_input.current!.value = "";
      return;
    } else {
      allowAnswerFlag = true;
      se.pi.play();
      el_text.current!.innerHTML = "";
      el_answer.current!.value = "";
      answer = Math.floor(leftCountValue + rightCountValue);
    }
    setCount((count) => count + 1);
  };

  const showAnswer = () => {
    if (!allowAnswerFlag) {
      se.pi.play();
      el_text.current!.innerHTML = "もんだい　または　セット";
      return;
    }
    se.seikai1.play();
    el_answer.current!.value = parseInt(el_answer.current!.value) == answer ? "" : answer.toString();
  };

  const checkAnswer = (myAnswer: number) => {
    // 回答チェック
    if (!allowAnswerFlag) {
      se.pi.play();
      el_text.current!.innerHTML = "もんだい　または　セット";
      return;
    }
    allowAnswerFlag = false;
    el_answer.current!.value = myAnswer.toString();
    answer == myAnswer ? sendRight(el_text) : sendWrong(el_text);
    //間違えたら、1秒後に再入力可能に。
    if (answer != myAnswer)
      setTimeout(() => {
        allowAnswerFlag = true;
        el_answer.current!.value = "";
      }, 1000);
  };

  const checkAnswerEvent = () => {
    if (!allowAnswerFlag) {
      se.pi.play();
      el_text.current!.innerHTML = "もんだい　または　セット";
      return;
    }
    const myAnswer = parseInt(el_answer.current!.value);
    if (myAnswer) checkAnswer(myAnswer);
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
    <Layout title="たしざん１">
      <div className="flex justify-center items-center">
        <PutSelect ITEM={ITEM} handleEvent={changeSelect}></PutSelect>

        <button className={styles.btn} style={{ display: "flex" }} onClick={giveQuestion}>
          <div style={{ display: "flex" }}>
            <FontAwesomeIcon icon={faQuestion} style={{ width: "20px" }} />
            {"もんだい"}
          </div>
        </button>
        <button className={styles.btn} onClick={setQuest}>
          <div style={{ display: "flex" }}>
            <FontAwesomeIcon icon={faUserEdit} className="w-8 h-8" />
            {"セット"}
          </div>
        </button>
        <button className={styles.btn} onClick={showAnswer}>
          <div style={{ display: "flex" }}>
            <FontAwesomeIcon icon={faEye} className="w-8 h-8" />
            {"こたえをみる"}
          </div>
        </button>
      </div>

      <PutText el_text={el_text}></PutText>

      <div className="flex justify-center items-center">
        <PutShiki
          kigo={"+"}
          el_right_input={el_right_input}
          el_left_input={el_left_input}
          el_answer={el_answer}
        ></PutShiki>
        <BtnCheck handleEvent={checkAnswerEvent} />
      </div>

      <div className={styles.place}>
        <Block leftCount={leftCountValue} rightCount={rightCountValue} />
      </div>

      <BtnNum ITEM={NUM_1} handleEvent={checkAnswer}></BtnNum>

      <BtnNum ITEM={NUM_2} handleEvent={checkAnswer}></BtnNum>
    </Layout>
  );
}
