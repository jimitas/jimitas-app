import React from "react";
import MainTitle from "@/components/MainTitle";
import Layout from "@/components/Layout";
import { BtnNum } from "@/components/PutButton/btnNum";
import { BtnCheck } from "@/components/PutButton/btnCheck";
import { BtnNext } from "@/components/PutButton/btnNext";
import { BtnSpace } from "@/components/PutButton/btnSpace";
import { BtnShuffle } from "@/components/PutButton/btnShuffle";
import { BtnQuestion } from "@/components/PutButton/btnQuestion";
import { BtnUndo } from "@/components/PutButton/btnUndo";
// import Links from "@/components/Links";
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
