import React from "react";
import Link from "next/link";
import * as LinksData from "./LinksData";

const ITEMS = LinksData.ITEMS;

// ポップアップ用のリンク表示コンポーネント（コンパクト版）
const LinksForPopup: React.FC = () => {
  return (
    <div>
      {ITEMS.map((itemGroup) => (
        <div key={itemGroup.title}>
          <hr />
          <div
            className="flex p-2 text-2xl md:text-3xl lg:text-4xl text-center md:text-start text-bold text-white bg-green-600"
          >
            {itemGroup.title}
          </div>

          {/* ポップアップ用コンパクトレイアウト */}
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
    </div>
  );
};

export default LinksForPopup;
