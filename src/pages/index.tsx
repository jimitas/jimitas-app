import React from "react";
import MainTitle from "src/components/MainTitle";
import Title from "src/components/Layout/Title";
import LinksForTopPage from "src/components/Links/LinksForTopPage";
import { Header } from "src/components/Header";

// トップページ（新しいUI構成版＋統一ヘッダー）
export default function Home() {
  return (
    <div>
      <Header />
      <div className="pt-8 md:pt-10 lg:pt-12 xl:pt-14">
        <Title title="" />
        <MainTitle />
        <br />
        <LinksForTopPage />
      </div>
    </div>
  );
}
