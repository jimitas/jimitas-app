import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";

export function TasuHissan() {
  // 初期設定 - 14tahi.jsの通り
  const [hikasu, setHikasu] = useState<number>(123);
  const [kasu, setKasu] = useState<number>(456);
  const [wa, setWa] = useState<number>(0);
  const [maxKeta] = useState<number>(4);
  const [hikasuArr, setHikasuArr] = useState<number[]>([]);
  const [kasuArr, setKasuArr] = useState<number[]>([]);
  const [waArr, setWaArr] = useState<number[]>([]);
  const [hikasuKeta, setHikasuKeta] = useState<number>(0);
  const [kasuKeta, setKasuKeta] = useState<number>(0);
  const [waKeta, setWaKeta] = useState<number>(0);
  const [problemType, setProblemType] = useState<number>(1);

  // スコアコインのみ保持
  const [scoreCoins, setScoreCoins] = useState<JSX.Element[]>([]);

  // 問題タイプのデータ
  const typeData = ["(２けた)+(２けた)", "(３けた)+(２けた)", "(２けた)+(３けた)", "(３けた)+(３けた)"];

  // refs
  const box1Ref = useRef<HTMLInputElement>(null);
  const box3Ref = useRef<HTMLInputElement>(null);
  const box5Ref = useRef<HTMLInputElement>(null);

  // ドラッグ&ドロップ処理（14tahi.js準拠）
  let globalDragged: HTMLElement | null = null;

  const dragStart = (e: DragEvent) => {
    const target = e.target as HTMLElement;
    if (target.draggable === true) {
      globalDragged = target;
    }
  };

  const dragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const dropEnd = (e: DragEvent) => {
    e.preventDefault();
    const target = e.target as HTMLElement;

    if (target.className.includes("droppable-elem") && !target.className.includes("droppable-elem-2") && globalDragged) {
      // 数字のドロップ処理
      if (globalDragged.parentNode) {
        globalDragged.parentNode.removeChild(globalDragged);
      }
      target.appendChild(globalDragged);

      // 数パレット内の数字を一旦消去
      const numPalletElement = document.getElementById("num_pallet");
      if (numPalletElement) {
        while (numPalletElement.firstChild) {
          numPalletElement.removeChild(numPalletElement.firstChild);
        }
      }
      numSet();
      kotaeInput();

    } else if (target.className.includes("droppable-elem-2") && globalDragged && globalDragged.tagName === "IMG") {
      // お金のドロップ処理
      if (globalDragged.parentNode) {
        globalDragged.parentNode.removeChild(globalDragged);
      }
      target.appendChild(globalDragged);
      imgKuriagari();
    }

    globalDragged = null;
  };

  // タッチ操作（14tahi.js準拠）
  const touchStart = (e: TouchEvent) => {
    e.preventDefault();
  };

  const touchMove = (e: TouchEvent) => {
    e.preventDefault();
    const draggedElem = e.target as HTMLElement;
    const touch = e.changedTouches[0];
    draggedElem.style.position = "fixed";
    draggedElem.style.top = touch.pageY - window.pageYOffset - draggedElem.offsetHeight / 2 + "px";
    draggedElem.style.left = touch.pageX - window.pageXOffset - draggedElem.offsetWidth / 2 + "px";
  };

  const touchEnd = (e: TouchEvent) => {
    e.preventDefault();
    const droppedElem = e.target as HTMLElement;
    droppedElem.style.position = "";
    droppedElem.style.top = "";
    droppedElem.style.left = "";

    const touch = e.changedTouches[0];
    const newParentElem = document.elementFromPoint(
      touch.pageX - window.pageXOffset,
      touch.pageY - window.pageYOffset
    ) as HTMLElement | null;

    if (newParentElem?.className.includes("droppable-elem") && !newParentElem?.className.includes("droppable-elem-2")) {
      newParentElem.appendChild(droppedElem);

      // 数パレット内の数字を一旦消去
      const numPalletElement = document.getElementById("num_pallet");
      if (numPalletElement) {
        while (numPalletElement.firstChild) {
          numPalletElement.removeChild(numPalletElement.firstChild);
        }
      }
      numSet();
      kotaeInput();
    }
  };

  const touchEndMoney = (e: TouchEvent) => {
    e.preventDefault();
    const droppedElem = e.target as HTMLElement;
    droppedElem.style.position = "";
    droppedElem.style.top = "";
    droppedElem.style.left = "";

    const touch = e.changedTouches[0];
    const newParentElem = document.elementFromPoint(
      touch.pageX - window.pageXOffset,
      touch.pageY - window.pageYOffset
    ) as HTMLElement | null;

    if (newParentElem?.className.includes("droppable-elem-2")) {
      newParentElem.appendChild(droppedElem);
      imgKuriagari();
    }
  };

  // 初期化
  useEffect(() => {
    hissanSet(hikasu, kasu);
    numSet();

    // ドラッグ&ドロップイベントリスナーを設定
    const handleDragStart = (e: Event) => dragStart(e as DragEvent);
    const handleDragOver = (e: Event) => dragOver(e as DragEvent);
    const handleDrop = (e: Event) => dropEnd(e as DragEvent);

    document.addEventListener("dragstart", handleDragStart, false);
    document.addEventListener("dragover", handleDragOver, false);
    document.addEventListener("drop", handleDrop, false);

    return () => {
      document.removeEventListener("dragstart", handleDragStart, false);
      document.removeEventListener("dragover", handleDragOver, false);
      document.removeEventListener("drop", handleDrop, false);
    };
  }, [hikasu, kasu]);

  // 関数　マス内の数字をクリア（DOM直接操作）
  const masuClear = () => {
    // 筆算テーブルをクリア
    const hissanTableElement = document.querySelector('#hissan-table');
    if (hissanTableElement) {
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          const cell = hissanTableElement.querySelector(`tr:nth-child(${row + 1}) td:nth-child(${col + 1})`);
          if (cell) {
            cell.innerHTML = "";
          }
        }
      }
    }

    // お金テーブルをクリア
    const moneyTableElement = document.querySelector('#money-table');
    if (moneyTableElement) {
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          const cell = moneyTableElement.querySelector(`tr:nth-child(${row + 1}) td:nth-child(${col + 1})`);
          if (cell) {
            cell.innerHTML = "";
          }
        }
      }
    }

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
  };

  // 関数　問題をセットする
  const mondaiSet = () => {
    const newHikasu = box1Ref.current ? parseInt(box1Ref.current.value) : hikasu;
    const newKasu = box3Ref.current ? parseInt(box3Ref.current.value) : kasu;
    setHikasu(newHikasu);
    setKasu(newKasu);
    hissanSet(newHikasu, newKasu);
  };

  // 関数　答えの表示
  const showAnswer = () => {
    if (box5Ref.current) {
      box5Ref.current.value = wa.toString();
      box5Ref.current.style.color = "blue";
    }

    // くり上がりの表示
    const hissanTableElement = document.querySelector('#hissan-table');
    if (hissanTableElement) {
      let tempKuriagari = 0;

      for (let col = 0; col < Math.min(hikasuKeta, kasuKeta); col++) {
        if (Math.floor(hikasuArr[col] + kasuArr[col] + tempKuriagari) > 9) {
          const cell = hissanTableElement.querySelector(`tr:nth-child(1) td:nth-child(${maxKeta - col - 1})`);
          if (cell) {
            cell.innerHTML = "1";
          }
          tempKuriagari = 1;
        } else {
          tempKuriagari = 0;
        }
      }

      // 筆算の答え表示
      for (let col = 0; col < waKeta; col++) {
        const cell = hissanTableElement.querySelector(`tr:nth-child(4) td:nth-child(${maxKeta - col})`);
        if (cell) {
          cell.innerHTML = waArr[col].toString();
        }
      }
    }
  };

  // 関数　答えの入力
  const kotaeInput = () => {
    const newHikasu = Math.floor(box1Ref.current ? parseInt(box1Ref.current.value) : 0);
    const newKasu = Math.floor(box3Ref.current ? parseInt(box3Ref.current.value) : 0);
    const newWa = Math.floor(newHikasu + newKasu);

    // 筆算マスからの値を計算（DOM操作版）
    const hissanTableElement = document.querySelector('#hissan-table');
    let calculatedAnswer = 0;

    if (hissanTableElement) {
      for (let col = 0; col < 4; col++) {
        const cell = hissanTableElement.querySelector(`tr:nth-child(4) td:nth-child(${col + 1})`);
        if (cell && cell.innerHTML) {
          const digit = parseInt(cell.innerHTML) || 0;
          calculatedAnswer += digit * Math.pow(10, 3 - col);
        }
      }
    }

    if (box5Ref.current) {
      box5Ref.current.value = calculatedAnswer.toString();

      if (calculatedAnswer === newWa) {
        box5Ref.current.style.color = "red";
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

  // マス内に数字を書き込む（DOM直接操作版）
  const suujiSet = (hikasuArray: number[], kasuArray: number[], hikasuKetaCount: number, kasuKetaCount: number, currentHikasu: number, currentKasu: number) => {
    // 一度　マス内の数字をクリア
    const hissanTableElement = document.querySelector('#hissan-table');
    if (hissanTableElement) {
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          const cell = hissanTableElement.querySelector(`tr:nth-child(${row + 1}) td:nth-child(${col + 1})`);
          if (cell) {
            cell.innerHTML = "";
          }
        }
      }

      // 被加数を代入
      for (let col = 0; col < hikasuKetaCount; col++) {
        const cell = hissanTableElement.querySelector(`tr:nth-child(2) td:nth-child(${maxKeta - col})`);
        if (cell) {
          cell.innerHTML = hikasuArray[col].toString();
        }
      }

      // 加数を代入
      for (let col = 0; col < kasuKetaCount; col++) {
        const cell = hissanTableElement.querySelector(`tr:nth-child(3) td:nth-child(${maxKeta - col})`);
        if (cell) {
          cell.innerHTML = kasuArray[col].toString();
        }
      }

      // +記号を設定
      if (currentHikasu < 100 && currentKasu < 100) {
        const cell = hissanTableElement.querySelector('tr:nth-child(3) td:nth-child(2)');
        if (cell) {
          cell.innerHTML = "+";
        }
      } else {
        const cell = hissanTableElement.querySelector('tr:nth-child(3) td:nth-child(1)');
        if (cell) {
          cell.innerHTML = "+";
        }
      }
    }
  };

  // マス内にお金を並べる（DOM直接操作版 - 14tahi.js準拠）
  const okaneSet = (hikasuArray: number[], kasuArray: number[], hikasuKetaCount: number, kasuKetaCount: number, currentHikasu: number, currentKasu: number) => {
    // 一度　マス内のお金をクリア
    const moneyTableElement = document.querySelector('#money-table');
    if (moneyTableElement) {
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          const cell = moneyTableElement.querySelector(`tr:nth-child(${row + 1}) td:nth-child(${col + 1})`);
          if (cell) {
            cell.innerHTML = "";
          }
        }
      }

      const imgArr = ["ichien", "juuen", "hyakuen"];

      // 被加数のお金を配置
      for (let col = 0; col < hikasuKetaCount; col++) {
        for (let i = 0; i < hikasuArray[col]; i++) {
          const img = document.createElement("img");
          img.setAttribute("src", `/images/${imgArr[col]}.png`);
          img.setAttribute("class", imgArr[col]);
          img.setAttribute("draggable", "true");
          img.style.width = "25px";
          img.style.height = "25px";
          img.style.cursor = "pointer";
          img.className = `${imgArr[col]} w-6 h-6 cursor-pointer`;
          img.addEventListener("touchstart", touchStart as any, false);
          img.addEventListener("touchmove", touchMove as any, false);
          img.addEventListener("touchend", touchEndMoney as any, false);

          const cell = moneyTableElement.querySelector(`tr:nth-child(2) td:nth-child(${maxKeta - col})`);
          if (cell) {
            cell.appendChild(img);
          }
        }
      }

      // 加数のお金を配置
      for (let col = 0; col < kasuKetaCount; col++) {
        for (let i = 0; i < kasuArray[col]; i++) {
          const img = document.createElement("img");
          img.setAttribute("src", `/images/${imgArr[col]}.png`);
          img.setAttribute("class", imgArr[col]);
          img.setAttribute("draggable", "true");
          img.style.width = "25px";
          img.style.height = "25px";
          img.style.cursor = "pointer";
          img.className = `${imgArr[col]} w-6 h-6 cursor-pointer`;
          img.addEventListener("touchstart", touchStart as any, false);
          img.addEventListener("touchmove", touchMove as any, false);
          img.addEventListener("touchend", touchEndMoney as any, false);

          const cell = moneyTableElement.querySelector(`tr:nth-child(3) td:nth-child(${maxKeta - col})`);
          if (cell) {
            cell.appendChild(img);
          }
        }
      }

      // +記号を設定
      if (currentHikasu < 100 && currentKasu < 100) {
        const cell = moneyTableElement.querySelector('tr:nth-child(3) td:nth-child(2)');
        if (cell) {
          cell.innerHTML = "+";
        }
      } else {
        const cell = moneyTableElement.querySelector('tr:nth-child(3) td:nth-child(1)');
        if (cell) {
          cell.innerHTML = "+";
        }
      }
    }
  };

  // 関数　数字のセット（DOM直接操作版）
  const numSet = () => {
    // 数字パレット内の数字を一旦消去
    const numPalletElement = document.getElementById("num_pallet");
    if (numPalletElement) {
      // タイトルを保持するため、h4以外を削除
      const children = Array.from(numPalletElement.children);
      children.forEach(child => {
        if (child.tagName !== 'H4') {
          child.remove();
        }
      });

      // 新しい数字要素を追加
      for (let i = 0; i < 10; i++) {
        const numberDiv = document.createElement('div');
        numberDiv.className = 'draggable-elem inline-block w-12 h-12 leading-12 bg-white text-3xl text-center rounded-sm border border-gray-800 cursor-pointer m-0.5';
        numberDiv.setAttribute('draggable', 'true');
        numberDiv.textContent = i.toString();

        // タッチイベントを追加
        numberDiv.addEventListener('touchstart', touchStart as any);
        numberDiv.addEventListener('touchmove', touchMove as any);
        numberDiv.addEventListener('touchend', touchEnd as any);

        numPalletElement.appendChild(numberDiv);
      }
    }
  };

  // くり上がりの操作（DOM直接操作版）
  const imgKuriagari = () => {
    const moneyTableElement = document.querySelector('#money-table');
    if (!moneyTableElement) return;

    // 1円列から順番にチェック（右から左）
    for (let col = 3; col >= 0; col--) {
      const currentCell = moneyTableElement.querySelector(`tr:nth-child(4) td:nth-child(${col + 1})`);

      if (currentCell) {
        // 1円列（col=3）の場合
        if (col === 3) {
          const ichienCount = currentCell.querySelectorAll('.ichien').length;

          if (ichienCount >= 10) {
            // 10個以上の1円がある場合、10円に変換
            const newJuuenCount = Math.floor(ichienCount / 10);

            // 既存の1円を削除
            currentCell.querySelectorAll('.ichien').forEach(coin => coin.remove());

            // 10円列に追加
            if (col > 0) {
              const targetCell = moneyTableElement.querySelector(`tr:nth-child(1) td:nth-child(${col})`);
              if (targetCell) {
                for (let i = 0; i < newJuuenCount; i++) {
                  const img = document.createElement("img");
                  img.setAttribute("src", "/images/juuen.png");
                  img.setAttribute("class", "juuen");
                  img.setAttribute("draggable", "true");
                  img.className = "juuen w-6 h-6 cursor-pointer";
                  img.addEventListener("touchstart", touchStart as any, false);
                  img.addEventListener("touchmove", touchMove as any, false);
                  img.addEventListener("touchend", touchEndMoney as any, false);
                  targetCell.appendChild(img);
                }
              }
            }
          }
        }

        // 10円列（col=2）の場合
        else if (col === 2) {
          const juuenCount = currentCell.querySelectorAll('.juuen').length;
          console.log("juuenCount", juuenCount);
          if (juuenCount >= 10) {
            // 10個以上の10円がある場合、100円に変換
            const newHyakuenCount = Math.floor(juuenCount / 10);
            const remainingJuuenCount = juuenCount % 10;

            // 既存の10円を削除
            currentCell.querySelectorAll('.juuen').forEach(coin => coin.remove());

            // 残りの10円を追加
            for (let i = 0; i < remainingJuuenCount; i++) {
              const img = document.createElement("img");
              img.setAttribute("src", "/images/juuen.png");
              img.setAttribute("class", "juuen");
              img.setAttribute("draggable", "true");
              img.className = "juuen w-6 h-6 cursor-pointer";
              img.addEventListener("touchstart", touchStart as any, false);
              img.addEventListener("touchmove", touchMove as any, false);
              img.addEventListener("touchend", touchEndMoney as any, false);
              currentCell.appendChild(img);
            }

            // 100円列に追加
            if (col > 0) {
              const targetCell = moneyTableElement.querySelector(`tr:nth-child(1) td:nth-child(${col})`);
              if (targetCell) {
                for (let i = 0; i < newHyakuenCount; i++) {
                  const img = document.createElement("img");
                  img.setAttribute("src", "/images/hyakuen.png");
                  img.setAttribute("class", "hyakuen");
                  img.setAttribute("draggable", "true");
                  img.className = "hyakuen w-6 h-6 cursor-pointer";
                  img.addEventListener("touchstart", touchStart as any, false);
                  img.addEventListener("touchmove", touchMove as any, false);
                  img.addEventListener("touchend", touchEndMoney as any, false);
                  targetCell.appendChild(img);
                }
              }
            }
          }
        }
        // 100円列（col=1）の場合
        else if (col === 1) {
          const hyakuenCount = currentCell.querySelectorAll('.hyakuen').length;
          console.log("hyakuenCount", hyakuenCount);
          if (hyakuenCount >= 10) {
            // 10個以上の100円がある場合、1000円に変換
            const newSenenCount = Math.floor(hyakuenCount / 10);
            const remainingHyakuenCount = hyakuenCount % 10;

            // 既存の100円を削除
            currentCell.querySelectorAll('.hyakuen').forEach(coin => coin.remove());

            // 残りの100円を追加
            for (let i = 0; i < remainingHyakuenCount; i++) {
              const img = document.createElement("img");
              img.setAttribute("src", "/images/hyakuen.png");
              img.setAttribute("class", "hyakuen");
              img.setAttribute("draggable", "true");
              img.className = "hyakuen w-6 h-6 cursor-pointer";
              img.addEventListener("touchstart", touchStart as any, false);
              img.addEventListener("touchmove", touchMove as any, false);
              img.addEventListener("touchend", touchEndMoney as any, false);
              currentCell.appendChild(img);
            }

            // 1000円列に追加
            if (col > 0) {
              const targetCell = moneyTableElement.querySelector(`tr:nth-child(1) td:nth-child(${col})`);
              if (targetCell) {
                for (let i = 0; i < newSenenCount; i++) {
                  const img = document.createElement("img");
                  img.setAttribute("src", "/images/senen.png");
                  img.setAttribute("class", "senen");
                  img.setAttribute("draggable", "true");
                  img.className = "senen w-12 h-6 cursor-pointer";
                  img.addEventListener("touchstart", touchStart as any, false);
                  img.addEventListener("touchmove", touchMove as any, false);
                  img.addEventListener("touchend", touchEndMoney as any, false);
                  targetCell.appendChild(img);
                }
              }
            }
          }
        }
      }
    }
  };

  // box5の値変更時のハンドラー
  const handleBox5Change = () => {
    if (box5Ref.current) {
      if (parseInt(box5Ref.current.value) === wa) {
        box5Ref.current.style.color = "red";
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
        <table id="hissan-table" className="h-60 mr-3">
          <tbody>
            {[0, 1, 2, 3].map(rowIndex => (
              <tr key={rowIndex} className="max-h-15">
                {[0, 1, 2, 3].map(colIndex => (
                  <td
                    key={colIndex}
                    className={`
                      border border-gray-800 w-14 max-w-14 h-14 max-h-14 text-center
                      ${rowIndex === 0 ? 'text-xl bg-yellow-100 text-red-500 align-bottom' : 'text-3xl bg-white text-black align-middle'}
                      ${rowIndex === 3 ? 'bg-yellow-100' : ''}
                      ${rowIndex === 0 || rowIndex === 3 ? 'droppable-elem' : ''}
                    `}
                  >
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
        <table id="money-table" className="h-60 ml-3">
          <tbody>
            {[0, 1, 2, 3].map(rowIndex => (
              <tr key={rowIndex} className="max-h-15">
                {[0, 1, 2, 3].map(colIndex => (
                  <td
                    key={colIndex}
                    className={`
                      droppable-elem-2 border border-gray-800 w-40 max-w-40 h-14 max-h-14 p-0.5
                      flex-wrap content-start items-start
                      ${rowIndex === 0 || rowIndex === 3 ? 'bg-yellow-100' : 'bg-white'}
                    `}
                  >
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
        className="mb-3 border border-gray-300 p-3"
      >
        <h4 className="text-lg font-semibold mb-2">数字パレット</h4>
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