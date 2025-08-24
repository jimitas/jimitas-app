import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalculator } from "@fortawesome/free-solid-svg-icons";
import styles from "./button.module.css";

interface BtnCalcProps {
  handleEvent: () => void;
  btnText?: string;
}

export function BtnCalc(props: BtnCalcProps) {
  const { handleEvent, btnText } = props;

  return (
    <div className="flex justify-center">
      <button onClick={handleEvent} className={styles.btnCalc}>
        <FontAwesomeIcon icon={faCalculator} />
        {btnText && <span className="ml-1">{btnText}</span>}
      </button>
    </div>
  );
}
