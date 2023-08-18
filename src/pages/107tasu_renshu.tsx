import * as se from "src/components/se";
import styles from "src/styles/Home.module.css";
import { useState, useRef, useEffect, useCallback } from "react";
import { BtnNum } from "src/components/PutButton/btnNum";
import { useCheckAnswer } from "src/hooks/useCheckAnswer";
import { PutSelect } from "src/components/PutSelect";
import { PutText } from "src/components/PutText";
import Layout from "src/components/Layout";

const NUM_1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const NUM_2 = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const ITEM = ["10までの　かず", "10+□,□+10", "1□+□,□+1□", "20までの　かず"];
var left_value: number = 0;
var right_value: number = 0;
var answer: number;
var inGame: boolean = false;
var timer: any = null;

export default function Tashizan1() {
  const { sendRight, sendWrong } = useCheckAnswer();
  const el_text = useRef<HTMLDivElement>(null);
  const [flag, setFlag] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [time, setTime] = useState<number>(60);
  const [score, setScore] = useState<number>(0);
  const [selectIndex, setSelectIndex] = useState<number>(0);

  // 問題の難易度をセレクト
  const changeSelect = useCallback((e: any) => {
    gameStopEvent();
    setSelectIndex(e.target.selectedIndex);
  }, []);

  useEffect(() => {
    el_text.current!.innerHTML = "スタートをおしてね";
    el_text.current!.style.backgroundColor = "lightgray";
    setTime(60);
    setScore(0);
  }, [selectIndex]);

  // ゲームを開始する
  const gameStartEvent = useCallback(() => {
    if (inGame) return;
    inGame = true;
    setFlag(false);
    setTime(60);
    setScore(0);
    se.pi.play();

    el_text.current!.innerHTML = "よーい";
    el_text.current!.style.backgroundColor = "antiquewhite";
    //１秒後にスタートの合図
    setTimeout(() => {
      el_text.current!.innerHTML = "スタート";
      se.set.play();
      giveQuestion();
      // タイマーの設置
      timer = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    }, 1000);
  }, []);

  useEffect(() => {
    if (time <= 0) {
      clearInterval(timer);
      timer = null;
      gameStopEvent();
      return;
    }
  }, [time]);

  // ゲームを終了する
  const gameStopEvent = useCallback(() => {
    if (!inGame) return;
    setFlag(false);
    inGame = false;
    se.seikai1.play();
    el_text.current!.style.backgroundColor = "lightgray";
    el_text.current!.innerHTML = "おわり(スタートで　もういちどチャレンジ)";
    clearInterval(timer);
    timer = null;
  }, []);

  // 問題を出す
  const giveQuestion = () => {
    if (!inGame) return;
    setFlag(true);
    const mode = Math.floor(Math.random() * 2 + 1);
    
    switch (selectIndex) {
      case 0:
        answer = Math.floor(Math.random() * 10 + 1);
        left_value = Math.floor(Math.random() * (answer + 1));
        right_value = answer - left_value;
        break;
      case 1:
        answer = Math.floor(Math.random() * 10 + 11);
        if (mode === 1) {
          left_value = 10;
          right_value = answer - left_value;
        } else if (mode === 2) {
          right_value = 10;
          left_value = answer - right_value;
        }
        break;
      case 2:
        answer = Math.floor(Math.random() * 9 + 12);
        if (mode === 1) {
          left_value = Math.floor(Math.random() * (answer - 11) + 1);
          right_value = answer - left_value;
        } else if (mode === 2) {
          right_value = Math.floor(Math.random() * (answer - 11) + 1);
          left_value = answer - right_value;
        }
        break;
      case 3:
        left_value = Math.floor(Math.random() * 9 + 2);
        right_value = Math.floor(Math.random() * left_value + (10 - left_value) + 1);
        answer = left_value + right_value;
        break;
    }
    el_text.current!.innerHTML = `${left_value}　+　${right_value}　=`;
  };

  // 回答チェック
  const checkAnswer = (myAnswer: number) => {
    if (!flag) return;
    setFlag(false);

    if (answer == myAnswer) {
      sendRight(el_text);
      setScore((score) => score + 1);
      setTimeout(() => {
        giveQuestion();
      }, 200);
    } else sendWrong(el_text);

    //間違えたら、0.2秒後に再入力可能に。
    if (answer != myAnswer)
      setTimeout(() => {
        el_text.current!.innerHTML = `${left_value}　+　${right_value}　=`;
        setFlag(true);
      }, 200);
  };

  return (
    <Layout title="たしざんのれんしゅう">
      <div className="flex flex-wrap justify-center items-center">
        <PutSelect ITEM={ITEM} handleEvent={changeSelect}></PutSelect>

        <button className={styles.btn} onClick={gameStartEvent}>
          {"スタート"}
        </button>
        <button className={styles.btn} onClick={gameStopEvent}>
          {"ストップ"}
        </button>
      </div>

      <div className="flex flex-wrap justify-center items-center m-5">
        <div className="flex flex-wrap justify-center items-center mr-5">
          {"のこり"}
          <div className="w-16 text-center text-3xl mx-1 border border-yellow-500">{time}</div>
          {"秒"}
        </div>
        <div className="flex flex-wrap justify-center items-center">
          {"とくてん"}
          <div className="w-16 text-center text-4xl mx-1 border border-yellow-500">{score}</div>
          {"もん　せいかい"}
        </div>
      </div>

      <PutText el_text={el_text}></PutText>

      <BtnNum ITEM={NUM_1} handleEvent={checkAnswer}></BtnNum>

      <BtnNum ITEM={NUM_2} handleEvent={checkAnswer}></BtnNum>
    </Layout>
  );
}
