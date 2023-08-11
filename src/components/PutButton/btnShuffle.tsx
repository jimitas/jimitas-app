import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRandom } from "@fortawesome/free-solid-svg-icons";
import styles from "src/components/PutButton/button.module.scss";

interface BtnShuffleProps {
  handleEvent: () => void;
  btnText?: string;
}

export function BtnShuffle(props: BtnShuffleProps) {
  const { handleEvent, btnText = "しゃっふる" } = props;

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <button onClick={handleEvent} className={styles.btnQuest}>
        <FontAwesomeIcon icon={faRandom} style={{width:"12px"}}/>
        {btnText}
      </button>
    </div>
  );
}
