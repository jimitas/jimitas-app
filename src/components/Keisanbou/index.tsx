import { useEffect, useState, useRef } from "react";
import styles from "src/components/Keisanbou/keisanbou.module.css";
import * as se from "src/components/se";
import { BtnCalc } from "src/components/PutButton/btnCalc";
import { BtnUndo } from "src/components/PutButton/btnUndo";
import { useDragDrop } from "src/hooks/useDragDrop";

// 計算棒コンポーネント（ドラッグ&ドロップで数を学習）
export function Keisanbou(props: { hyaku?: number; ju?: number; ichi?: number }) {
  //はじめに並べる数を取得する。
  const hyaku = props.hyaku || 0;
  const ju = props.ju || 0;
  const ichi = props.ichi || 0;
  const item_length = [hyaku, ju, ichi];

  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);

  // ドロップ時にカウントを更新するコールバック
  const handleDrop = () => {
    setCount2((prev) => prev + 1);
  };

  // カスタムフックからドラッグ&ドロップ機能を取得
  const { dragStart, dragOver, dropEnd, touchStart, touchMove, touchEnd } = useDragDrop(handleDrop);

  const el_hyaku_place = useRef<HTMLTableCellElement>(null);
  const el_ju_place = useRef<HTMLTableCellElement>(null);
  const el_ichi_place = useRef<HTMLTableCellElement>(null);

  const el_put_place = useRef<HTMLTableRowElement>(null);
  const el_set_place = useRef<HTMLDivElement>(null);
  const el_calc_result = useRef<HTMLDivElement>(null);

  const resetEvent = () => {
    se.alertSound.play();
    const result = window.confirm("リセットしますか？");
    if (result === false) return;

    setCount1((count1) => count1 + 1);
    se.reset.play();
  };

  //計算棒にイベントを追加
  const ITEMS = ["k-hyaku", "k-ju", "k-ichi"];
  const ITEMS_IMG_WIDTH = ["7vw", "3vw", "1.5vw"];
  const ITEMS_IMG_HEIGHT = ["7vw", "7vw", "7vw"]; // 各計算棒の高さを位に応じて設定
  const imgAddEvent = (img: HTMLImageElement, i: number) => {
    img.setAttribute("draggable", "true");
    img.setAttribute("src", `images/${ITEMS[i]}.png`);
    img.className = `draggable-elem ${ITEMS[i]}`;
    img.style.width = ITEMS_IMG_WIDTH[i];
    img.style.height = ITEMS_IMG_HEIGHT[i];
    img.style.objectFit = "contain"; // 画像のアスペクト比を保持しつつサイズに合わせる
    img.addEventListener("touchstart", touchStart, false);
    img.addEventListener("touchmove", touchMove, false);
    img.addEventListener("touchend", touchEnd, false);
  };

  //指定された数だけ、計算棒をputTableに並べる。
  const el_putTable = [el_hyaku_place, el_ju_place, el_ichi_place];
  useEffect(() => {
    for (let i = 0; i < 3; i++) {
      const ele = el_putTable[i].current;
      if (!ele) continue;
      while (ele.firstChild) {
        ele.removeChild(ele.firstChild);
      }
      for (let j = 0; j < item_length[i]; j++) {
        const img = document.createElement("img");
        imgAddEvent(img, i); //計算棒にイベントを追加
        el_putTable[i].current?.appendChild(img);
      }
    }
    if (el_calc_result.current) {
      el_calc_result.current.innerText = "";
    }
  }, [count1]);

  // ドラッグエンドを検出して、計算棒のストックを補充する。
  useEffect(() => {
    const ele2 = el_set_place.current;
    if (ele2 != null) {
      while (ele2.firstChild) {
        ele2.removeChild(ele2.firstChild);
      }
    }
    for (let i = 0; i < ITEMS.length; i++) {
      const img = document.createElement("img");
      imgAddEvent(img, i); //計算棒にイベントを追加
      el_set_place.current?.appendChild(img);
    }

    document.addEventListener("dragstart", dragStart, false);
    document.addEventListener("dragover", dragOver, false);
    document.addEventListener("drop", dropEnd, false);

    //アンマウント時にイベントを解除しておかないと、重複してしまい大変！
    return () => {
      document.removeEventListener("dragstart", dragStart, false);
      document.removeEventListener("dragover", dragOver, false);
      document.removeEventListener("drop", dropEnd, false);
    };
  }, [count2]);

  //並べた数を表示する。
  const calcValue = () => {
    const ele = el_put_place.current;
    if (!ele) return;
    const hyaku_count = ele.getElementsByClassName("draggable-elem k-hyaku").length;
    const ju_count = ele.getElementsByClassName("draggable-elem k-ju").length;
    const ichi_count = ele.getElementsByClassName("draggable-elem k-ichi").length;
    const Value = Math.floor(hyaku_count * 100 + ju_count * 10 + ichi_count);
    if (el_calc_result.current) {
      el_calc_result.current.innerText = Value.toString();
    }
    se.seikai1.play();
    setTimeout(() => {
      if (el_calc_result.current) {
        el_calc_result.current.innerText = "";
      }
    }, 1500);
  };

  // ドラッグ&ドロップ機能はuseDragDropフックから取得済み

  return (
    <div>
      <section className="flex justify-center">
        <table className={styles.table}>
          <tbody>
            <tr ref={el_put_place}>
              <td
                ref={el_hyaku_place}
                style={{ width: "35vw", backgroundColor: "pink", minWidth: "35vw" }}
                className="p-2 droppable-elem"
              ></td>
              <td
                ref={el_ju_place}
                style={{ width: "25vw", backgroundColor: "lightYellow", minWidth: "25vw" }}
                className="p-2 droppable-elem"
              ></td>
              <td
                ref={el_ichi_place}
                style={{ width: "15vw", backgroundColor: "lightBlue", minWidth: "15vw" }}
                className="p-2 droppable-elem"
              ></td>
            </tr>
          </tbody>
        </table>
        <img src="images/gomibako.png" style={{ width: "6vw", height: "6vw" }} className="mt-auto droppable-elem" alt="ゴミ箱" />
      </section>

      <section className="flex justify-center mt-4">
        <div className="flex justify-center">
          <div ref={el_set_place} className={styles.setPlace}></div>
        </div>

        <BtnCalc handleEvent={calcValue} />

        <BtnUndo handleEvent={resetEvent} />

        <div ref={el_calc_result} className={`place w-20 ${styles.calcResult}`}></div>
      </section>
    </div>
  );
}