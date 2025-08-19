import React, { RefObject } from "react";
import styles from "src/components/PutShiki/PutShiki.module.css";

interface PutShikiProps {
  el_right_input: RefObject<HTMLInputElement>;
  el_left_input: RefObject<HTMLInputElement>;
  el_answer: RefObject<HTMLInputElement>;
  kigo: string;
}

export function PutShiki({ 
  el_left_input, 
  el_right_input, 
  el_answer, 
  kigo 
}: PutShikiProps) {
  return (
    <div className={styles.place}>
      <input 
        ref={el_left_input} 
        className={styles.input} 
        type="number" 
        name="number" 
        max="20" 
        min="0" 
        step="1"
      />
      <span className={styles.kigo}>{kigo}</span>
      <input 
        ref={el_right_input} 
        className={styles.input} 
        type="number" 
        name="number" 
        max="20" 
        min="0" 
        step="1" 
      />
      <span className={styles.kigo}>＝</span>
      <input 
        ref={el_answer} 
        className={styles.input} 
        type="number" 
        name="number" 
        max="40" 
        min="0" 
        step="1"
      />
    </div>
  );
}
