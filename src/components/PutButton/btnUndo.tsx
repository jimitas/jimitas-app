import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo } from "@fortawesome/free-solid-svg-icons";
import styles from "./button.module.css";

interface BtnUndoProps {
  handleEvent: () => void;
}

export function BtnUndo(props: BtnUndoProps) {
  const { handleEvent } = props;

  return (
    <div className="flex flex-wrap justify-center">
      <button className={styles.btnUndo} onClick={handleEvent}>
        <FontAwesomeIcon icon={faUndo} className="w-8 h-8" />
      </button>
    </div>
  );
}
