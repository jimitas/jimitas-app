import styles from "src/components/PutSelect/putSelect.module.css";

export function PutSelect(props) {
  const ITEM = props.ITEM;
  const handleEvent = props.handleEvent;
  return (
    <div style={styles.plece}>
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
