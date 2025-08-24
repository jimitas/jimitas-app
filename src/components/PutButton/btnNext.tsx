import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import styles from "./button.module.css";


interface BtnNextProps {
  handleEvent: () => void;
}

export function BtnNext(props: BtnNextProps) {
  const { handleEvent } = props;

  return (
    <div  className="flex flex-wrap justify-center">
      <button className={styles.btnNext} onClick={handleEvent}>
        <FontAwesomeIcon icon={faArrowRight} className="w-8 h-8"/>
      </button>
    </div>
  );
}
