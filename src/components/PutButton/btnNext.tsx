import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import styles from "src/components/PutButton/button.module.scss";

interface BtnNextProps {
  handleEvent: () => void;
}

export function BtnNext(props: BtnNextProps) {
  const { handleEvent } = props;

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <button className={styles.btnNext} onClick={handleEvent}>
        <FontAwesomeIcon icon={faArrowRight} />
      </button>
    </div>
  );
}
