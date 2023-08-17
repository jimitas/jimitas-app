import * as se from "src/components/se";
import styles from "../styles/Home.module.css";
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
import Layout from "@/components/Layout";
import { BtnCheck } from "@/components/PutButton/btnCheck";

const NUM_1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const NUM_2 = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const ITEM = ["～10", "10-□", "1□-□", "1□-□=□"];
var left_value: number;
var right_value: number;
var answer: number;
var inGame: boolean = false;
var remainingTime: number = 60;
var getPoint: number = 0;
var timer: any = null;

export default function Hikizan1() {
  const { sendRight, sendWrong } = useCheckAnswer();
  const el_text = useRef<HTMLDivElement>(null);
  const el_time = useRef<HTMLDivElement>(null);
  const [flag, setFlag] = useState<boolean>(true);
  const [count, setCount] = useState<number>(0);
  const [selectIndex, setSelectIndex] = useState<number>(0);

  // 初期化
  useEffect(() => {
    el_text.current!.innerHTML = "スタートをおしてね";
    el_text.current!.style.backgroundColor = "lightgray";
  }, [selectIndex]);

  // 問題の難易度をセレクト
  const changeSelect = (e: any) => {
    gameStopEvent();
    const selectedIndex: number = e.target.selectedIndex;
    setSelectIndex(selectedIndex);
  };

  // ゲームを開始する
  const gameStartEvent = () => {
    if (inGame) return;
    inGame = true;
    setFlag(false);
    remainingTime = 60;
    getPoint = 0;
    se.pi.play();

    el_time.current!.innerHTML = remainingTime.toString();
    el_text.current!.innerHTML = "よーい";
    el_text.current!.style.backgroundColor = "antiquewhite";

    //１秒後にスタートの合図
    setTimeout(() => {
      el_text.current!.innerHTML = "スタート";
      se.set.play();
      giveQuestion();
      // タイマーの設置
      timer = setInterval(() => {
        remainingTime--;
        el_time.current!.innerHTML = remainingTime.toString();
        if (remainingTime <= 0) {
          clearInterval(timer);
          timer = null;
          gameStopEvent();
          return;
        }
      }, 1000);
    }, 1000);
  };

  // ゲームを終了する
  const gameStopEvent = () => {
    if (!inGame) return;
    setFlag(false);
    inGame = false;
    se.seikai1.play();
    el_text.current!.style.backgroundColor = "lightgray";
    el_text.current!.innerHTML = "おわり(スタートで　もういちどチャレンジ)";

    clearInterval(timer);
    timer = null;
  };

  // 問題を出す
  const giveQuestion = () => {
    if (!inGame) return;
    setFlag(true);

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
    el_text.current!.innerHTML = `${left_value}　-　${right_value}　=`;
    setCount((count) => count + 1);
  };

  // 回答チェック
  const checkAnswer = (myAnswer: number) => {
    if (!flag) return;
    setFlag(false);

    if (answer == myAnswer) {
      sendRight(el_text);
      getPoint++;
      setTimeout(() => {
        giveQuestion();
      }, 200);
    } else sendWrong(el_text);

    //間違えたら、0.2秒後に再入力可能に。
    if (answer != myAnswer)
      setTimeout(() => {
        el_text.current!.innerHTML = `${left_value}　-　${right_value}　=`;
        setFlag(true);
      }, 200);
  };

  return (
    <Layout title="ひきざんのれんしゅう">
      <div className="flex flex-wrap justify-center items-center m-5">
        <PutSelect ITEM={ITEM} handleEvent={changeSelect}></PutSelect>

        <button className={styles.btn} onClick={gameStartEvent}>
          {"スタート"}
        </button>
        <button className={styles.btn} onClick={gameStopEvent}>
          {"ストップ"}
        </button>
      </div>

      <div className="flex flex-wrap justify-center items-center">
        <div className="flex flex-wrap justify-center items-center mr-5">
          {"のこり"}
          <div ref={el_time} className="w-16 text-center text-3xl mx-1 border border-yellow-500">
            {60}
          </div>
          {"秒"}
        </div>
        <div className="flex flex-wrap justify-center items-center">
          {"とくてん"}
          <div className="w-16 text-center text-4xl mx-1 border border-yellow-500">{getPoint}</div>
          {"もん　せいかい"}
        </div>
      </div>

      <PutText el_text={el_text}></PutText>

      <BtnNum ITEM={NUM_1} handleEvent={checkAnswer}></BtnNum>

      <BtnNum ITEM={NUM_2} handleEvent={checkAnswer}></BtnNum>
    </Layout>
  );
}
