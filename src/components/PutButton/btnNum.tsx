import React from "react";
import styles from "./button.module.css";

interface BtnNumProps {
  ITEM: number[]; // ITEMはnumber型の配列として指定します
  handleEvent: (num: number) => void; // handleEventは引数としてnumberを受け取る関数として指定します
}

export function BtnNum(props: BtnNumProps) {
  const { ITEM, handleEvent } = props;

  const handleClick = (num: number) => {
    handleEvent(num);
  };


  return (
    <div className="flex flex-wrap justify-center">
      {ITEM.map((num) => (
        <button className={styles.btnNum} onClick={() => handleClick(num)} key={num} value={num}>
          {num}
        </button>
      ))}
    </div>
  );
}
