import React from "react";
import Link from "next/link";
import { faCircleChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as LinksData from "./LinksData";

const ITEMS = LinksData.ITEMS;

// トップページ用のリンク表示コンポーネント（学年別ジャンプリンク＋カード式レイアウト）
const LinksForTopPage: React.FC = () => {
  return (
    <div>
      {/* 学年別ジャンプリンク */}
      <div className="flex ps-3 pb-2 text-blue-700 space-x-3">
        <Link className="hover:bg-blue-500 hover:text-white" href="#grade-1">
          １ねん
        </Link>
        <Link className="hover:bg-blue-500 hover:text-white" href="#grade-2">
          ２年
        </Link>
        <Link className="hover:bg-blue-500 hover:text-white" href="#grade-3">
          ３年
        </Link>
        <Link className="hover:bg-blue-500 hover:text-white" href="#grade-4">
          ４年
        </Link>
        <Link className="hover:bg-blue-500 hover:text-white" href="#grade-5">
          ５年
        </Link>
        <Link className="hover:bg-blue-500 hover:text-white" href="#grade-6">
          ６年
        </Link>
        <Link className="hover:bg-blue-500 hover:text-white" href="#dougu-bako">
          どうぐばこ
        </Link>
      </div>
      
      {/* 学年別コンテンツ一覧 */}
      {ITEMS.map((itemGroup) => (
        <div key={itemGroup.title}>
          <hr />
          <div
            id={itemGroup.id}
            className="flex p-2 text-2xl md:text-3xl lg:text-4xl text-center md:text-start text-bold text-white bg-green-600"
          >
            {itemGroup.title}
            <Link href="#">
              <FontAwesomeIcon
                icon={faCircleChevronUp}
                className="w-12 h-6 md:h-7 lg:h-8 text-white cursor-pointer hover:opacity-80 hover:transition duration-300"
              />
            </Link>
          </div>

          {/* コンテンツボタン（カード式レイアウト） */}
          <div className="m-3 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {itemGroup.links.map((item) => (
              <div key={item.href} className="flex justify-center">
                <Link href={item.href}>
                  <button
                    type="button"
                    className="w-40 md:w-48 lg:w-56 my-2 mx-2 text-sm md:text-base lg:text-lg bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-2 border border-blue-500 hover:border-transparent rounded "
                  >
                    {item.title}
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ))}
      {/* ページ下部に余白を追加 */}
      <div style={{ height: "90vh" }}></div>
    </div>
  );
};

export default LinksForTopPage;
