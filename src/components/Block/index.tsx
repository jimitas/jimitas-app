import React, { useEffect, useState, useRef } from "react";
import * as se from "src/components/se";
import styles from "src/components/Block/Block.module.css";

import { useDragDrop } from "src/hooks/useDragDrop";
import { BtnSpace } from "src/components/PutButton/btnSpace";
import { BtnUndo } from "src/components/PutButton/btnUndo";

const divColor = ["#ff8082", "#005aff", "#ff8082", "#005aff"];

interface BlockProps {
  leftCount: number;
  rightCount: number;
}

export function Block(props: BlockProps) {
  // 自前の Drag アンド Drop の hooks
  // react-draggableだとやはり、パフォーマンスが落ちるのと、カラーチェンジやCSSの当て方がうまくいかないため、やはり却下します。
  const { dragStart, dragOver, dropEnd, touchStart, touchMove, touchEnd } =
    useDragDrop();

  // ４つの数図ブロックの親要素
  const el_table = useRef<HTMLDivElement>(null);

  // ４つの数図ブロックに格納する数の算出
  const left_up = props.leftCount > 10 ? 10 : 0 || 0;
  const right_up = props.rightCount > 10 ? 10 : 0 || 0;
  const left_down =
    props.leftCount > 10
      ? props.leftCount - 10
      : props.leftCount === 0
      ? 0
      : props.leftCount || 10;
  const right_down =
    props.rightCount > 10
      ? props.rightCount - 10
      : props.rightCount === 0
      ? 0
      : props.rightCount || 10;

  const [count, setCount] = useState(0);

  const resetTable = () => {
    setCount((count) => count + 1);
    se.seikai1.play();
  };

  // 動的に数図ブロックを作ったほうがuseDrag&Dropの動きが良かった。

  useEffect(() => {
    const ele = el_table.current;
    while (ele?.firstChild) {
      ele.removeChild(ele.firstChild);
    }
    for (let i = 0; i < 4; i++) {
      const TBL = document.createElement("table");
      ele?.appendChild(TBL);
      for (let j = 0; j < 2; j++) {
        const tr = document.createElement("tr");
        TBL.appendChild(tr);
        for (let k = 0; k < 5; k++) {
          const td = document.createElement("td");
          td.className = "droppable-elem";
          tr.appendChild(td);

          if (
            (i === 0 && j * 5 + k < left_up) ||
            (i === 1 && j * 5 + k < right_up) ||
            (i === 2 && j * 5 + k < left_down) ||
            (i === 3 && j * 5 + k < right_down)
          ) {
            let colorIndex = i;
            let touchStartFlag = false;

            const div = document.createElement("div");
            div.className = "draggable-elem";
            div.setAttribute("draggable", "true");
            td.appendChild(div);
            div.style.backgroundColor = divColor[colorIndex];

            // 裏返すと色が変わる関数
            const colorChange = (e: MouseEvent | TouchEvent) => {
              se.pi.play();
              colorIndex++;
              // e.target.style.transform =
              //   e.target.style.transform == "rotateY(180deg)" ? "rotateY(0deg)" : "rotateY(180deg)";
              // div.style.backgroundColor = divColor[colorIndex % 2];
              const target = e.target as HTMLElement;
              target.style.transform =
                target.style.transform == "rotateY(180deg)"
                  ? "rotateY(0deg)"
                  : "rotateY(180deg)";
              div.style.backgroundColor = divColor[colorIndex % 2];
            };

            // 150ミリ秒以内にタッチして指を離すとき，クリックイベントと同じ挙動とみなす。
            const touchStartEvent = () => {
              touchStartFlag === false
                ? (touchStartFlag = true)
                : (touchStartFlag = false);
              setTimeout(() => {
                touchStartFlag = false;
              }, 150);
            };
            const touchEndEvent = (e: TouchEvent) => {
              touchStartFlag === true ? colorChange(e) : null;
            };

            div.addEventListener("click", colorChange, false);
            div.addEventListener("dragstart", dragStart, false);
            div.addEventListener("dragover", dragOver, false);
            div.addEventListener("drop", dropEnd, false);
            div.addEventListener("touchstart", touchStart, false);
            div.addEventListener("touchstart", touchStartEvent, false);
            div.addEventListener("touchmove", touchMove, false);
            div.addEventListener("touchend", touchEnd, false);
            div.addEventListener("touchend", touchEndEvent, false);
          }
        }
      }
    }
  }, [count, left_down, left_up, right_down, right_up, dragStart, dragOver, dropEnd, touchStart, touchMove, touchEnd]);

  return (
    <div className="flex justify-center flex-wrap items-end">
      <BtnSpace></BtnSpace>
      {/* ドラッグイベントは、親要素に反映させる必要あり */}

      <div
        ref={el_table}
        className={styles.table}
        onDragStart={(e) => dragStart(e.nativeEvent)}
        onDragOver={(e) => dragOver(e.nativeEvent)}
        onDrop={(e) => dropEnd(e.nativeEvent)}
      ></div>
      <BtnUndo handleEvent={resetTable}></BtnUndo>
    </div>
  );
}
