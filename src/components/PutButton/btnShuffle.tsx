import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRandom } from "@fortawesome/free-solid-svg-icons";
import styles from "./button.module.css";


interface BtnShuffleProps {
  handleEvent: () => void;
  btnText?: string;
}

export function BtnShuffle(props: BtnShuffleProps) {
  const { handleEvent, btnText = "しゃっふる" } = props;

  return (
    <div  className="flex flex-wrap justify-center">
      <button onClick={handleEvent} className={styles.btnShuffle}>
        <FontAwesomeIcon icon={faRandom} className="w-8 h-8"/>
        {btnText}
      </button>
    </div>
  );
}
