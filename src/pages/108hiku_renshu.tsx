// ひきざん練習ページのメインロジック
import * as se from "src/components/se"; // 効果音管理
import styles from "src/styles/Home.module.css"; // スタイル
import { useState, useRef, useEffect, useCallback } from "react"; // Reactフック
import { BtnNum } from "src/components/PutButton/btnNum"; // 数字ボタン
import { useCheckAnswer } from "src/hooks/useCheckAnswer"; // 正誤判定用フック
import { PutSelect } from "src/components/PutSelect"; // 難易度セレクト
import { PutText } from "src/components/PutText"; // 問題・メッセージ表示
import Layout from "src/components/Layout"; // レイアウト共通

// 数字ボタンの配列
const NUM_1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const NUM_2 = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
// 難易度選択肢
const ITEM = ["～10", "10-□", "1□-□", "1□-□=□"];
// 問題用の変数（グローバル管理）
let left_value: number;
let right_value: number;
let answer: number;
let inGame: boolean = false; // ゲーム中フラグ
let timer: NodeJS.Timeout | null = null; // タイマーID

export default function Hikizan1() {
  // 正誤判定用の関数取得
  const { sendRight, sendWrong } = useCheckAnswer();
  // 問題文表示用のref
  const el_text = useRef<HTMLDivElement>(null);
  // ゲーム状態管理
  const [flag, setFlag] = useState<boolean>(true); // 回答受付フラグ
  const [count, setCount] = useState<number>(0); // 問題数カウント
  const [time, setTime] = useState<number>(60); // 残り秒数
  const [score, setScore] = useState<number>(0); // 正解数
  const [selectIndex, setSelectIndex] = useState<number>(0); // 難易度

  // ゲームを終了する処理
  const gameStopEvent = useCallback(() => {
    if (!inGame) return;
    setFlag(false);
    inGame = false;
    se.seikai1.play(); // 終了音
    el_text.current!.style.backgroundColor = "lightgray";
    el_text.current!.innerHTML = "おわり(スタートで　もういちどチャレンジ)";
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }, []);

  // 問題を出す処理
  const giveQuestion = useCallback(() => {
    if (!inGame) return;
    setFlag(true);
    switch (selectIndex) {
      case 0:
        // 10までのひきざん
        left_value = Math.floor(Math.random() * 10 + 1);
        right_value = Math.floor(Math.random() * left_value + 1);
        break;
      case 1:
        // 10-□パターン
        left_value = 10;
        right_value = Math.floor(Math.random() * left_value + 1);
        break;
      case 2:
        // 1□-□パターン
        left_value = Math.floor(Math.random() * 9 + 11);
        right_value = Math.floor(Math.random() * (left_value - 11));
        break;
      case 3:
        // 1□-□=□パターン
        left_value = Math.floor(Math.random() * 9 + 11);
        const ichi = 20 - left_value;
        right_value = Math.floor(Math.random() * ichi + (10 - ichi));
        break;
    }
    answer = left_value - right_value;
    el_text.current!.innerHTML = `${left_value}　-　${right_value}　=`;
  }, [selectIndex]);

  // ゲームを開始する処理
  const gameStartEvent = useCallback(() => {
    if (inGame) return;
    inGame = true;
    setFlag(false);
    setTime(60);
    setScore(0);
    se.pi.play(); // 開始音
    el_text.current!.innerHTML = "よーい";
    el_text.current!.style.backgroundColor = "antiquewhite";
    // 1秒後にスタート
    setTimeout(() => {
      el_text.current!.innerHTML = "スタート";
      se.set.play();
      giveQuestion();
      // タイマー開始
      timer = setInterval(() => {
        setTime((time) => (time > 0 ? time - 1 : 0));
      }, 1000);
    }, 1000);
  }, [giveQuestion]);

  // 難易度セレクト変更時の処理
  const changeSelect = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    gameStopEvent(); // ゲームを一旦終了
    setSelectIndex(e.target.selectedIndex);
  }, [gameStopEvent]);

  // 難易度変更時の初期化
  useEffect(() => {
    el_text.current!.innerHTML = "スタートをおしてね";
    el_text.current!.style.backgroundColor = "lightgray";
    setTime(60);
    setScore(0);
  }, [selectIndex]);

  // 残り時間監視（0になったら終了）
  useEffect(() => {
    if (time <= 0) {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      gameStopEvent();
      return;
    }
  }, [time, gameStopEvent]);

  // 回答チェック処理
  const checkAnswer = (myAnswer: number) => {
    if (!flag) return; // 回答受付中のみ
    setFlag(false);
    if (answer == myAnswer) {
      sendRight(el_text); // 正解時の処理
      setScore((score) => score + 1);
      setTimeout(() => {
        giveQuestion(); // 次の問題
      }, 200);
    } else sendWrong(el_text); // 不正解時の処理
    // 間違えた場合、0.2秒後に再入力可能に
    if (answer != myAnswer)
      setTimeout(() => {
        el_text.current!.innerHTML = `${left_value}　-　${right_value}　=`;
        setFlag(true);
      }, 200);
  };

  // 画面描画
  return (
    <Layout title="ひきざんのれんしゅう">
      {/* 難易度セレクト・スタート/ストップボタン */}
      <div className="flex flex-wrap justify-center items-center">
        <PutSelect ITEM={ITEM} handleEvent={changeSelect}></PutSelect>
        <button className={styles.btn} onClick={gameStartEvent}>スタート</button>
        <button className={styles.btn} onClick={gameStopEvent}>ストップ</button>
      </div>
      {/* 残り時間・スコア表示 */}
      <div className="flex flex-wrap justify-center items-center m-5">
        <div className="flex flex-wrap justify-center items-center mr-5">
          のこり
          <div className="w-16 text-center text-3xl mx-1 border border-yellow-500">{time}</div>
          秒
        </div>
        <div className="flex flex-wrap justify-center items-center">
          とくてん
          <div className="w-16 text-center text-4xl mx-1 border border-yellow-500">{score}</div>
          もん　せいかい
        </div>
      </div>
      {/* 問題文表示 */}
      <PutText el_text={el_text}></PutText>
      {/* 数字ボタン */}
      <BtnNum ITEM={NUM_1} handleEvent={checkAnswer}></BtnNum>
      <BtnNum ITEM={NUM_2} handleEvent={checkAnswer}></BtnNum>
    </Layout>
  );
}
