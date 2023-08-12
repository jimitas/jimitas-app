import Draggable from "react-draggable";
import styles from "src/components/Hide/Hide.module.css";

//本当は、関数を実行する前に、id="Tables"を確立してからそこへアクセスできるようにしたい。
//useEffectで可能。解決済み。

export function Hide() {
  return (
    <div>
      <Draggable defaultPosition={{ x: 0, y: 0 }}>
        <div className={styles.hide} style={{ position: "relative" }}>
          <div className={styles.grip}></div>
        </div>
      </Draggable>
    </div>
  );
}
