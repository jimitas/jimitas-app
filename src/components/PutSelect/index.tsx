import React from "react";
import styles from "src/components/PutSelect/putSelect.module.css";

interface PutSelectProps {
  ITEM: (string | number)[];
  handleEvent: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function PutSelect({ ITEM, handleEvent }: PutSelectProps) {
  return (
    <div>
      <select
        onChange={handleEvent}
        className="text-center font-bold m-2 p-2 min-w-24 text-base md:text-xl border-green-400 text-black border-2 rounded-lg shadow-lg"
      >
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