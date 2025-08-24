import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import styles from "./button.module.css";

interface BtnCheckProps {
  handleEvent: () => void;
  btnText?: string;
}

export function BtnCheck(props: BtnCheckProps) {
  const { handleEvent, btnText = "こたえあわせ" } = props;

  return (
    <div className="flex flex-wrap justify-center">
      <button onClick={handleEvent} className={styles.btnCheck}>
        <FontAwesomeIcon icon={faCheck} className="w-8 h-8"/>
        {btnText}
      </button>
    </div>
  );
}
