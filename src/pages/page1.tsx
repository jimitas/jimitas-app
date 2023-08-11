import React from "react";
// import MainTitle from "@/components/MainTitle";
import Layout from "@/components/Layout";
import { BtnNum } from "@/components/PutButton/btnNum";
// import Links from "@/components/Links";
const NUM: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const checkNumber = (num: number) => {
  console.log(num);
};

export default function Home() {
  return (
    <Layout title="">
      <div>page1</div>
      {/* <MainTitle /> */}
      <br />
      {/* <Links /> */}
      <BtnNum ITEM={NUM} handleEvent={checkNumber} />
    </Layout>
  );
}
