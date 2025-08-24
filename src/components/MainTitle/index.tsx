import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCat } from "@fortawesome/free-solid-svg-icons";

// メインタイトル表示用のコンポーネント（レスポンシブ対応版）
const MainTitle: React.FC = () => {
  return (
    <div>
      <div className="mt-5 flex justify-center items-center">
        <div className="w-8 sm:w-10 md:w-12 lg:w-14">
          <FontAwesomeIcon className="text-lg sm:text-2xl md:text-3xl lg:text-4xl me-2" icon={faCat} />
        </div>
        <div className="text-lg sm:text-2xl md:text-3xl lg:text-4xl ">
          <div className="text-center font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            Jimitas
            <span className="text-sm sm:text-xl md:text-2xl lg:text-3xl">(ジミタス)</span>
          </div>
          <div className="text-sm sm:text-md md:text-xl lg:text-2xl">
            <ruby>
              地味
              <rt>じみ</rt>
            </ruby>
            に
            <ruby>
              助<rt>たす</rt>
            </ruby>
            かる
            <ruby>
              学習
              <rt>がくしゅう</rt>
            </ruby>
            コンテンツ
          </div>
        </div>
        <div className="w-8 sm:w-10 md:w-12 lg:w-14">
          <FontAwesomeIcon className="text-lg sm:text-2xl md:text-3xl lg:text-4xl ms-2" icon={faCat} />
        </div>
      </div>
    </div>
  );
};

export default MainTitle;

