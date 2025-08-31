import React, { useState, useEffect } from "react";
import * as se from "src/components/se";

// KukuRenshu_1コンポーネントのメインインターフェース
interface KukuRenshu_1Props {
  // 必要に応じて追加のpropsを定義
}

// 九九の問題を表すインターフェース
interface KukuProblem {
  dan: number;
  type: number;
  currentNum: number;
  showAnswer: boolean;
}

// メインコンポーネント: KukuRenshu_1
export function KukuRenshu_1() {
  // ステート管理
  const [selectedDan, setSelectedDan] = useState<number>(1);
  const [selectedType, setSelectedType] = useState<number>(1);
  const [currentNum, setCurrentNum] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [yomiText, setYomiText] = useState<string>("");
  const [yomiKotae, setYomiKotae] = useState<string>("");
  const [shikiText, setShikiText] = useState<string>("");
  const [shikiKotae, setShikiKotae] = useState<string>("");
  const [yomiHide, setYomiHide] = useState<boolean>(false);
  const [isSet, setIsSet] = useState<boolean>(false);

  // 九九の読み方データ
  const kukua = [
    "いんいち　が", "いんに　が", "いんさん　が", "いんし　が", "いんご　が",
    "いんろく　が", "いんしち　が", "いんはち　が", "いんく　が",
    "にいち　が", "ににん　が", "にさん　が", "にし　が", "にご",
    "にろく", "にしち", "にはち（には）", "にく",
    "さんいち　が", "さんに　が", "さざん　が", "さんし", "さんご",
    "さぶろく", "さんしち", "さんぱ", "さんく",
    "しいち　が", "しに　が", "しさん", "しし", "しご",
    "しろく", "ししち", "しは（しわ）", "しく",
    "ごいち　が", "ごに", "ごさん", "ごし", "ごご",
    "ごろく", "ごしち", "ごはち", "ごっく",
    "ろくいち　が", "ろくに", "ろくさん", "ろくし", "ろくご",
    "ろくろく", "ろくしち", "ろくは", "ろっく",
    "しちいち　が", "しちに", "しちさん", "しちし", "しちご",
    "しちろく", "しちしち", "しちは", "しちく",
    "はちいち　が", "はちに", "はちさん（はっさん）", "はちし（はっし）", "はちご",
    "はちろく", "はちしち", "はっぱ", "はっく",
    "くいち　が", "くに", "くさん", "くし", "くご",
    "くろく", "くしち", "くはち", "くく",
  ];

  const kukub = [
    "いち", "に", "さん", "し", "ご", "ろく", "しち", "はち", "く",
    "に", "し", "ろく", "はち", "じゅう", "じゅうに", "じゅうし", "じゅうろく", "じゅうはち",
    "さん", "ろく", "く", "じゅうに", "じゅうご", "じゅうはち", "にじゅういち", "にじゅうし", "にじゅうしち",
    "し", "はち", "じゅうに", "じゅうろく", "にじゅう", "にじゅうし", "にじゅうはち", "さんじゅうに", "さんじゅうろく",
    "ご", "じゅう", "じゅうご", "にじゅう", "にじゅうご", "さんじゅう", "さんじゅうご", "しじゅう", "しじゅうご",
    "ろく", "じゅうに", "じゅうはち", "にじゅうし", "さんじゅう", "さんじゅうろく", "しじゅうに", "しじゅうはち", "ごじゅうし",
    "しち", "じゅうし", "にじゅういち", "にじゅうはち", "さんじゅうご", "しじゅうに", "しじゅうく", "ごじゅうろく", "ろくじゅうさん",
    "はち", "じゅうろく", "にじゅうし", "さんじゅうに", "しじゅう", "しじゅうはち", "ごじゅうろく", "ろくじゅうし", "しちじゅうに",
    "く", "じゅうはち", "にじゅうしち", "さんじゅうろく", "しじゅうご", "ごじゅうし", "ろくじゅうさん", "しちじゅうに", "はちじゅういち",
  ];

  const typeData = ["上がり九九", "下がり九九", "ばらばら"];

  // セットボタンの処理
  const handleSet = () => {
    try {
      se.set.play();
    } catch (error) {
      console.log("Sound playback failed:", error);
    }

    setCurrentNum(0);
    setYomiText(selectedDan + "のだんの");
    setYomiKotae("れんしゅう");
    setShikiText("");
    setShikiKotae("");
    setIsSet(true);
  };

  // つぎボタンの処理
  const handleNext = () => {
    if (!isSet) return;

    try {
      se.pi.play();
    } catch (error) {
      console.log("Sound playback failed:", error);
    }

    const newNum = currentNum + 1;
    setCurrentNum(newNum);

    // かけられる数
    const hijousu = selectedDan;
    // かける数の配列を生成
    let jousu: number[] = [];

    switch (selectedType) {
      case 1: // 上がり九九
        jousu = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        break;
      case 2: // 下がり九九
        jousu = [9, 8, 7, 6, 5, 4, 3, 2, 1];
        break;
      case 3: // ばらばら
        const bara = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        for (let index = 0; index < 9; index++) {
          jousu.push(...bara.splice(Math.floor(Math.random() * bara.length), 1));
        }
        break;
    }

    if (newNum % 2 === 1) {
      // 問題表示
      if (!yomiHide) {
        setYomiText(kukua[(hijousu - 1) * 9 + jousu[Math.floor(newNum / 2)] - 1] + "　　");
      } else {
        setYomiText("");
      }
      setYomiKotae("");
      setShikiText(hijousu + "×" + jousu[Math.floor(newNum / 2)] + "＝");
      setShikiKotae("？");
    } else {
      // 答え表示
      if (!yomiHide) {
        setYomiText(kukua[(hijousu - 1) * 9 + jousu[Math.floor(newNum / 2 - 1)] - 1] + "　　");
        setYomiKotae(kukub[(hijousu - 1) * 9 + jousu[Math.floor(newNum / 2 - 1)] - 1]);
      } else {
        setYomiText("");
        setYomiKotae("");
      }
      setShikiText(hijousu + "×" + jousu[Math.floor(newNum / 2 - 1)] + "＝");
      setShikiKotae(String(hijousu * jousu[Math.floor(newNum / 2 - 1)]));
    }

    if (newNum > 17) setCurrentNum(0);
  };

  // よみを隠すチェックボックスの処理
  const handleYomiHideChange = () => {
    try {
      se.set.play();
    } catch (error) {
      console.log("Sound playback failed:", error);
    }
    setYomiHide(!yomiHide);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* コントロール部分 */}
      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
        <select
          id="dan_menu"
          value={selectedDan}
          onChange={(e) => setSelectedDan(Number(e.target.value))}
          className="px-4 py-2 border-2 border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:outline-none"
        >
          {Array.from({ length: 9 }, (_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}のだん</option>
          ))}
        </select>

        <select
          id="dan_type"
          value={selectedType}
          onChange={(e) => setSelectedType(Number(e.target.value))}
          className="px-4 py-2 border-2 border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:outline-none"
        >
          {typeData.map((type, index) => (
            <option key={index + 1} value={index + 1}>{type}</option>
          ))}
        </select>

        <button
          id="set"
          onClick={handleSet}
          className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md"
        >
          セット
        </button>

        <button
          id="next"
          onClick={handleNext}
          disabled={!isSet}
          className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          つぎ
        </button>
        {/* よみを隠すチェックボックス */}
        <form className="flex items-center">
          <label className="flex items-center ml-2 gap-2 cursor-pointer text-lg">
            <input
              type="checkbox"
              id="yomi_hide"
              checked={yomiHide}
              onChange={handleYomiHideChange}
              className="w-6 h-6 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700">よみをかくす。</span>
          </label>
        </form>
      </div>

      <div className="bg-yellow-100 rounded-lg border-2 border-blue-200 h-fit">
        {/* よみ表示部分 */}
        <div className="YOMI flex flex-col lg:flex-row p-2 ">
          <div id="yomi" className="text-2xl font-bold text-orange-500">{yomiText}</div>
          <div id="yomi_kotae" className="text-2xl text-orange-500">{yomiKotae}</div>
        </div>

        {/* 式表示部分 */}
        <div className="SHIKI flex items-center gap-2 p-2">
          <div id="shiki" className="text-5xl font-bold text-blue-500">{shikiText}</div>
          <div id="shiki_kotae" className="text-5xl font-bold text-blue-500">{shikiKotae}</div>
        </div>
      </div>


    </div>
  );
}