import React from "react";
import MainTitle from "src/components/MainTitle";
import Layout from "src/components/Layout";
import { BtnNum } from "src/components/PutButton/btnNum";
import { BtnCheck } from "src/components/PutButton/btnCheck";
import { BtnNext } from "src/components/PutButton/btnNext";
import { BtnSpace } from "src/components/PutButton/btnSpace";
import { BtnShuffle } from "src/components/PutButton/btnShuffle";
import { BtnQuestion } from "src/components/PutButton/btnQuestion";
import { BtnUndo } from "src/components/PutButton/btnUndo";
// import Links from "src/components/Links";
const NUM: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const checkNumber = (num: number) => {
  console.log(num);
};
const checkAnswer = () => {
  console.log();
};
const nextQuestion = () => {};
const setQuestion = () => {};
const resetUndo = () => {};
const shuffleElements = () => {};

export default function Home() {
  return (
    <Layout title="ボタンテスト">
      <div>page1</div>
      <br />
      {/* <Links /> */}
      <BtnCheck handleEvent={checkAnswer} />
      <BtnNext handleEvent={nextQuestion} />
      <BtnNum ITEM={NUM} handleEvent={checkNumber} />
      <BtnQuestion handleEvent={setQuestion} />
      <BtnShuffle handleEvent={shuffleElements} />
      <BtnSpace />
      <BtnUndo handleEvent={resetUndo} />
    </Layout>
  );
}
