import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useDragDrop } from "src/hooks/useDragDrop";

export function TasuHissan() {
  // 初期設定 - 14tahi.jsの通り
  const [hikasu, setHikasu] = useState<number>(123);
  const [kasu, setKasu] = useState<number>(456);
  const [wa, setWa] = useState<number>(0);
  const [maxKeta] = useState<number>(4);
  const [kuriagari, setKuriagari] = useState<number>(0);
  const [hikasuArr, setHikasuArr] = useState<number[]>([]);
  const [kasuArr, setKasuArr] = useState<number[]>([]);
  const [waArr, setWaArr] = useState<number[]>([]);
  const [hikasuKeta, setHikasuKeta] = useState<number>(0);
  const [kasuKeta, setKasuKeta] = useState<number>(0);
  const [waKeta, setWaKeta] = useState<number>(0);
  const [problemType, setProblemType] = useState<number>(1);

  // 筆算テーブルの状態
  const [hissanTable, setHissanTable] = useState<string[][]>([
    ['', '', '', ''], // くり上がり行
    ['', '', '', ''], // 被加数行
    ['', '', '', ''], // 加数行
    ['', '', '', '']  // 答え行
  ]);

  // お金テーブルの状態
  const [moneyTable, setMoneyTable] = useState<JSX.Element[][]>([
    [<></>, <></>, <></>, <></>],
    [<></>, <></>, <></>, <></>],
    [<></>, <></>, <></>, <></>],
    [<></>, <></>, <></>, <></>]
  ]);

  // 数字パレット
  const [numberPalette, setNumberPalette] = useState<JSX.Element[]>([]);
  const [scoreCoins, setScoreCoins] = useState<JSX.Element[]>([]);

  // 問題タイプのデータ
  const typeData = ["(２けた)+(２けた)", "(３けた)+(２けた)", "(２けた)+(３けた)", "(３けた)+(３けた)"];

  // refs
  const box1Ref = useRef<HTMLInputElement>(null);
  const box3Ref = useRef<HTMLInputElement>(null);
  const box5Ref = useRef<HTMLInputElement>(null);

  // ドラッグ&ドロップ - カスタムドロップコールバック
  const handleCustomDropCallback = () => {
    regenerateNumberPalette();
    kotaeInput();
  };

  const { dragStart, dragOver, dropEnd, touchStart, touchMove, touchEnd } = useDragDrop(handleCustomDropCallback);

  // 数字パレットの再生成
  const regenerateNumberPalette = () => {
    numSet();
  };

  // くり上がりの操作
  const imgKuriagari = () => {
    const imgArr = ["ichien", "juuen", "hyakuen", "senen"];
    // ここでお金のくり上がり処理を実装
    // 10個以上のコインがある場合、上位の桁に変換
  };

  // 初期化
  useEffect(() => {
    hissanSet(hikasu, kasu);
    numSet();

    // ドラッグ&ドロップイベントリスナーを設定
    document.addEventListener("dragstart", dragStart as EventListener, false);
    document.addEventListener("dragover", dragOver as EventListener, false);
    document.addEventListener("drop", dropEnd as EventListener, false);

    return () => {
      document.removeEventListener("dragstart", dragStart as EventListener, false);
      document.removeEventListener("dragover", dragOver as EventListener, false);
      document.removeEventListener("drop", dropEnd as EventListener, false);
    };
  }, [dragStart, dragOver, dropEnd]);

  // 関数　マス内の数字をクリア
  const masuClear = () => {
    // se.reset効果音をここで再生
    setHissanTable([
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', '']
    ]);
    setMoneyTable([
      [<></>, <></>, <></>, <></>],
      [<></>, <></>, <></>, <></>],
      [<></>, <></>, <></>, <></>],
      [<></>, <></>, <></>, <></>]
    ]);
    if (box1Ref.current) box1Ref.current.value = "";
    if (box3Ref.current) box3Ref.current.value = "";
    if (box5Ref.current) box5Ref.current.value = "";
    setScoreCoins([]);
  };

  // 関数　問題をランダムに出す
  const shutudai = () => {
    let newHikasu: number;
    let newKasu: number;

    switch (problemType) {
      case 1: // (２けた)+(２けた)
        newHikasu = Math.floor(Math.random() * 90 + 10);
        newKasu = Math.floor(Math.random() * 90 + 10);
        break;
      case 2: // (３けた)+(２けた)
        newHikasu = Math.floor(Math.random() * 900 + 100);
        newKasu = Math.floor(Math.random() * 90 + 10);
        break;
      case 3: // (２けた)+(３けた)
        newHikasu = Math.floor(Math.random() * 90 + 10);
        newKasu = Math.floor(Math.random() * 900 + 100);
        break;
      case 4: // (３けた)+(３けた)
        newHikasu = Math.floor(Math.random() * 900 + 100);
        newKasu = Math.floor(Math.random() * 900 + 100);
        break;
      default:
        newHikasu = 123;
        newKasu = 456;
    }

    setHikasu(newHikasu);
    setKasu(newKasu);
    if (box1Ref.current) box1Ref.current.value = newHikasu.toString();
    if (box3Ref.current) box3Ref.current.value = newKasu.toString();
    hissanSet(newHikasu, newKasu);
    // se.set効果音をここで再生
  };

  // 関数　問題をセットする
  const mondaiSet = () => {
    const newHikasu = box1Ref.current ? parseInt(box1Ref.current.value) : hikasu;
    const newKasu = box3Ref.current ? parseInt(box3Ref.current.value) : kasu;
    setHikasu(newHikasu);
    setKasu(newKasu);
    hissanSet(newHikasu, newKasu);
    // se.set効果音をここで再生
  };

  // 関数　答えの表示
  const showAnswer = () => {
    if (box5Ref.current) {
      box5Ref.current.value = wa.toString();
      box5Ref.current.style.color = "blue";
    }
    // se.seikai2効果音をここで再生

    // くり上がりの表示
    const newHissanTable = [...hissanTable];
    let tempKuriagari = 0;

    for (let col = 0; col < Math.min(hikasuKeta, kasuKeta); col++) {
      if (Math.floor(hikasuArr[col] + kasuArr[col] + tempKuriagari) > 9) {
        newHissanTable[0][maxKeta - col - 2] = "1";
        tempKuriagari = 1;
      } else {
        tempKuriagari = 0;
      }
    }

    // 筆算の答え表示
    for (let col = 0; col < waKeta; col++) {
      newHissanTable[3][maxKeta - col - 1] = waArr[col].toString();
    }

    setHissanTable(newHissanTable);
  };

  // 関数　答えの入力
  const kotaeInput = () => {
    const newHikasu = Math.floor(box1Ref.current ? parseInt(box1Ref.current.value) : 0);
    const newKasu = Math.floor(box3Ref.current ? parseInt(box3Ref.current.value) : 0);
    const newWa = Math.floor(newHikasu + newKasu);

    // 筆算マスからの値を計算
    const calculatedAnswer =
      parseInt(hissanTable[3][0] || '0') * 1000 +
      parseInt(hissanTable[3][1] || '0') * 100 +
      parseInt(hissanTable[3][2] || '0') * 10 +
      parseInt(hissanTable[3][3] || '0') * 1;

    if (box5Ref.current) {
      box5Ref.current.value = calculatedAnswer.toString();

      if (calculatedAnswer === newWa) {
        box5Ref.current.style.color = "red";
        // se.seikai1効果音をここで再生
        scoreWrite();
      } else {
        box5Ref.current.style.color = "black";
      }
    }
  };

  // スコアの描画
  const scoreWrite = () => {
    const newCoin = (
      <Image
        key={scoreCoins.length}
        src="/images/coin.png"
        alt="coin"
        width={32}
        height={32}
        className="w-8 h-8"
      />
    );
    setScoreCoins(prev => [...prev, newCoin]);
  };

  // 関数　筆算の描画
  const hissanSet = (newHikasu: number, newKasu: number) => {
    if (newHikasu > 999 || newKasu > 999 || newHikasu < 0 || newKasu < 0) {
      // se.alert効果音をここで再生
      alert("数字は1～999までにしてください。");
      if (box1Ref.current) box1Ref.current.value = "";
      if (box3Ref.current) box3Ref.current.value = "";
      return;
    }

    if (box5Ref.current) {
      box5Ref.current.style.color = "black";
    }

    const flooredHikasu = Math.floor(newHikasu);
    const flooredKasu = Math.floor(newKasu);
    const flooredWa = Math.floor(flooredHikasu + flooredKasu);

    setHikasu(flooredHikasu);
    setKasu(flooredKasu);
    setWa(flooredWa);

    if (box1Ref.current) box1Ref.current.value = flooredHikasu.toString();
    if (box3Ref.current) box3Ref.current.value = flooredKasu.toString();
    if (box5Ref.current) box5Ref.current.value = "";

    // 数字を配列として代入
    const newHikasuKeta = String(flooredHikasu).length;
    const newKasuKeta = String(flooredKasu).length;
    const newWaKeta = String(flooredWa).length;

    setHikasuKeta(newHikasuKeta);
    setKasuKeta(newKasuKeta);
    setWaKeta(newWaKeta);

    const newHikasuArr: number[] = [];
    const newKasuArr: number[] = [];
    const newWaArr: number[] = [];

    for (let i = 0; i < newHikasuKeta; i++) {
      newHikasuArr[i] = Number(String(flooredHikasu).charAt(newHikasuKeta - i - 1));
    }
    for (let i = 0; i < newKasuKeta; i++) {
      newKasuArr[i] = Number(String(flooredKasu).charAt(newKasuKeta - i - 1));
    }
    for (let i = 0; i < newWaKeta; i++) {
      newWaArr[i] = Number(String(flooredWa).charAt(newWaKeta - i - 1));
    }

    setHikasuArr(newHikasuArr);
    setKasuArr(newKasuArr);
    setWaArr(newWaArr);

    suujiSet(newHikasuArr, newKasuArr, newHikasuKeta, newKasuKeta, flooredHikasu, flooredKasu);
    okaneSet(newHikasuArr, newKasuArr, newHikasuKeta, newKasuKeta, flooredHikasu, flooredKasu);
  };

  // マス内に数字を書き込む
  const suujiSet = (hikasuArray: number[], kasuArray: number[], hikasuKetaCount: number, kasuKetaCount: number, currentHikasu: number, currentKasu: number) => {
    const newHissanTable = [
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', '']
    ];

    // 被加数を代入
    for (let col = 0; col < hikasuKetaCount; col++) {
      newHissanTable[1][maxKeta - col - 1] = hikasuArray[col].toString();
    }

    // 加数を代入
    for (let col = 0; col < kasuKetaCount; col++) {
      newHissanTable[2][maxKeta - col - 1] = kasuArray[col].toString();
    }

    // +記号を設定
    if (currentHikasu < 100 && currentKasu < 100) {
      newHissanTable[2][1] = "+";
    } else {
      newHissanTable[2][0] = "+";
    }

    setHissanTable(newHissanTable);
  };

  // マス内にお金を並べる
  const okaneSet = (hikasuArray: number[], kasuArray: number[], hikasuKetaCount: number, kasuKetaCount: number, currentHikasu: number, currentKasu: number) => {
    const newMoneyTable = [
      [<></>, <></>, <></>, <></>],
      [<></>, <></>, <></>, <></>],
      [<></>, <></>, <></>, <></>],
      [<></>, <></>, <></>, <></>]
    ];

    const imgArr = ["ichien", "juuen", "hyakuen"];

    // 被加数のお金を配置
    for (let col = 0; col < hikasuKetaCount; col++) {
      const coinCount = hikasuArray[col];
      const coins = [];
      for (let i = 0; i < coinCount; i++) {
        coins.push(
          <Image
            key={`h-${col}-${i}`}
            src={`/images/${imgArr[col]}.png`}
            alt={`${imgArr[col]} coin`}
            width={24}
            height={24}
            className={`${imgArr[col]} w-6 h-6 cursor-pointer`}
            draggable="true"
            onTouchStart={touchStart as any}
            onTouchMove={touchMove as any}
            onTouchEnd={touchEnd as any}
          />
        );
      }
      newMoneyTable[1][maxKeta - col - 1] = <>{coins}</>;
    }

    // 加数のお金を配置
    for (let col = 0; col < kasuKetaCount; col++) {
      const coinCount = kasuArray[col];
      const coins = [];
      for (let i = 0; i < coinCount; i++) {
        coins.push(
          <Image
            key={`k-${col}-${i}`}
            src={`/images/${imgArr[col]}.png`}
            alt={`${imgArr[col]} coin`}
            width={24}
            height={24}
            className={`${imgArr[col]} w-6 h-6 cursor-pointer`}
            draggable="true"
            onTouchStart={touchStart as any}
            onTouchMove={touchMove as any}
            onTouchEnd={touchEnd as any}
          />
        );
      }
      newMoneyTable[2][maxKeta - col - 1] = <>{coins}</>;
    }

    // +記号を設定
    if (currentHikasu < 100 && currentKasu < 100) {
      newMoneyTable[2][1] = <>+</>;
    } else {
      newMoneyTable[2][0] = <>+</>;
    }

    setMoneyTable(newMoneyTable);
  };

  // 関数　数字のセット
  const numSet = () => {
    const numbers = [];
    for (let i = 0; i < 10; i++) {
      numbers.push(
        <div
          key={i}
          className="draggable-elem inline-block w-12 h-12 leading-12 bg-white text-3xl text-center rounded-sm border border-gray-800 cursor-pointer m-0.5"
          draggable="true"
          onTouchStart={touchStart as any}
          onTouchMove={touchMove as any}
          onTouchEnd={touchEnd as any}
        >
          {i}
        </div>
      );
    }
    setNumberPalette(numbers);
  };

  // box5の値変更時のハンドラー
  const handleBox5Change = () => {
    if (box5Ref.current) {
      if (parseInt(box5Ref.current.value) === wa) {
        box5Ref.current.style.color = "red";
        // se.seikai1効果音をここで再生
      } else {
        box5Ref.current.style.color = "black";
      }
    }
  };

  return (
    <div className="p-5">
      {/* タイトル */}
      <h2 className="text-2xl font-bold mb-4">たし算のひっ算(タッチのみ対応)</h2>

      {/* ボタンセクション */}
      <section className="mb-3">
        <button
          className="mx-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 border-0"
          onClick={masuClear}
        >
          クリア
        </button>

        <select
          value={problemType}
          onChange={(e) => setProblemType(parseInt(e.target.value))}
          className="text-base mx-1 px-1 py-1 border border-gray-300 rounded"
        >
          {typeData.map((type, index) => (
            <option key={index + 1} value={index + 1}>
              {type}
            </option>
          ))}
        </select>

        <button
          className="mx-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 border-0"
          onClick={shutudai}
        >
          もんだい
        </button>

        <button
          className="mx-1 px-3 py-1 bg-cyan-600 text-white rounded hover:bg-cyan-700 border-0"
          onClick={mondaiSet}
        >
          セット
        </button>

        <button
          className="mx-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 border-0"
          onClick={showAnswer}
        >
          こたえ
        </button>
      </section>

      {/* 式ボックス */}
      <section className="flex mb-3 items-center">
        <input
          ref={box1Ref}
          type="number"
          max={999}
          min={10}
          defaultValue={hikasu}
          className="keisan_shiki mx-1 px-1 py-1 text-2xl w-20 border border-gray-300 rounded"
        />
        <div className="kigo mx-1 text-2xl">+</div>
        <input
          ref={box3Ref}
          type="number"
          max={999}
          min={10}
          defaultValue={kasu}
          className="keisan_shiki mx-1 px-1 py-1 text-2xl w-20 border border-gray-300 rounded"
        />
        <div className="kigo mx-1 text-lg">=</div>
        <input
          ref={box5Ref}
          type="number"
          className="keisan_shiki mx-1 px-1 py-1 text-lg w-20 border border-gray-300 rounded"
          onChange={handleBox5Change}
        />
      </section>

      {/* フィールド */}
      <div className="flex mb-3">
        {/* 筆算マス */}
        <table className="h-60 mr-3">
          <tbody>
            {hissanTable.map((row, rowIndex) => (
              <tr key={rowIndex} className="max-h-15">
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className={`
                      border border-gray-800 w-14 max-w-14 h-14 max-h-14 text-center
                      ${rowIndex === 0 ? 'text-xl bg-yellow-100 text-red-500 align-bottom' : 'text-3xl bg-white text-black align-middle'}
                      ${rowIndex === 3 ? 'bg-yellow-100' : ''}
                      ${rowIndex === 0 || rowIndex === 3 ? 'droppable-elem' : ''}
                    `}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* ゴミ箱 */}
        <Image
          className="droppable-elem w-16 h-16 relative left-3 top-36"
          src="/images/gomibako.png"
          alt="ゴミ箱"
          width={64}
          height={64}
        />

        {/* お金パレット */}
        <table className="h-60 ml-3">
          <tbody>
            {moneyTable.map((row, rowIndex) => (
              <tr key={rowIndex} className="max-h-15">
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className={`
                      droppable-elem-2 border border-gray-800 w-40 max-w-40 h-14 max-h-14 p-0.5
                      flex-col content-start items-start
                      ${rowIndex === 0 || rowIndex === 3 ? 'bg-yellow-100' : 'bg-white'}
                    `}
                  >
                    <div className="flex flex-wrap content-start items-start">
                      {cell}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 数字パレット */}
      <div
        id="num_pallet"
        className="droppable-elem mb-3 border border-gray-300 p-3"
      >
        <h4 className="text-lg font-semibold mb-2">数字パレット</h4>
        {numberPalette}
      </div>

      {/* スコアパレット */}
      <div id="score_pallet">
        <h4 className="text-lg font-semibold mb-2">スコア</h4>
        <div className="flex flex-wrap">
          {scoreCoins}
        </div>
      </div>
    </div>
  );
}