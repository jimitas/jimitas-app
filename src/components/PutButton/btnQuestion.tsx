import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import styles from "src/components/PutButton/button.module.scss";

interface BtnQuestionProps {
  handleEvent: () => void;
  btnText?: string;
}

export function BtnQuestion(props: BtnQuestionProps) {
  const { handleEvent, btnText = "もんだい" } = props;

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <button onClick={handleEvent} className={styles.btnQuest}>
        {/* <FontAwesomeIcon icon={faQuestion}/> */}
        {"?"}
        {btnText}
      </button>
    </div>
  );
}
