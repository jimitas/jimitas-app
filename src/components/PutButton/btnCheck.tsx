import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import styles from "src/components/PutButton/button.module.scss";

interface BtnCheckProps {
  handleEvent: () => void;
  btnText?: string;
}

export function BtnCheck(props: BtnCheckProps) {
  const { handleEvent, btnText = "こたえあわせ" } = props;

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <button onClick={handleEvent} className={styles.btnQuest}>
        <FontAwesomeIcon icon={faCheck} style={{width:"12px"}}/>
        {btnText}
      </button>
    </div>
  );
}
