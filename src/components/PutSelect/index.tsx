import React from "react";
import styles from "src/components/PutSelect/putSelect.module.css";

interface PutSelectProps {
  ITEM: (string | number)[];
  handleEvent: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function PutSelect({ ITEM, handleEvent }: PutSelectProps) {
  return (
    <div className={styles.place}> {/* 修正: plece → place */}
      <select onChange={handleEvent} className={styles.select} style={{ margin: "0 5px" }}>
        {ITEM.map((item) => {
          return (
            <option key={item} value={item}>
              {item}
            </option>
          );
        })}
      </select>
    </div>
  );
}