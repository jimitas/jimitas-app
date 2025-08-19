import React, { RefObject } from "react";
import styles from "src/components/PutText/putText.module.css";

interface PutTextProps {
  el_text: RefObject<HTMLDivElement>;
  text?: string;
}

export function PutText({ el_text, text }: PutTextProps) {
  return (
    <div>
      <div ref={el_text} className={styles.textBox}>
        {text}
      </div>
    </div>
  );
}
