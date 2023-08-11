import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import styles from "src/components/PutButton/button.module.scss";

interface BtnQuestionProps {
  handleEvent: () => void;
  btnText?: string;
}

export function BtnQuestion(props: BtnQuestionProps) {
  const { handleEvent, btnText = "もんだい" } = props;

  return (
    <div  className="flex flex-wrap justify-center">
      <button onClick={handleEvent} className={styles.btnQuest} >
        <FontAwesomeIcon icon={faQuestion} className="w-8 h-8"/>
        {btnText}
      </button>
    </div>
  );
}
