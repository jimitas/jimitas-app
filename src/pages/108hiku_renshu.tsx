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
const ITEM = ["～10", "10-□", "1□-□", "1□-□=□"];
var left_value: number;
var right_value: number;
var answer: number;
var inGame: boolean = false;
var timer: NodeJS.Timeout | null = null;

export default function Hikizan1() {
  const { sendRight, sendWrong } = useCheckAnswer();
  const el_text = useRef<HTMLDivElement>(null);
  const [flag, setFlag] = useState<boolean>(true);
  const [count, setCount] = useState<number>(0);
  const [time, setTime] = useState<number>(60);
  const [score, setScore] = useState<number>(0);
  const [selectIndex, setSelectIndex] = useState<number>(0);

  // 問題の難易度をセレクト
  // 空コメント追加（プッシュのため）
  const changeSelect = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
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
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
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
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }, []);

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
        el_text.current!.innerHTML = `${left_value}　-　${right_value}　=`;
        setFlag(true);
      }, 200);
  };

  return (
    <Layout title="ひきざんのれんしゅう">
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
          <div className="w-16 text-center text-3xl mx-1 border border-yellow-500">{60}</div>
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
