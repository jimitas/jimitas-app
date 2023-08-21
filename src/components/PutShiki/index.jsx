import styles from "src/components/PutShiki/PutShiki.module.css";
export function PutShiki(props) {
  const el_right_input = props.el_right_input;
  const el_left_input = props.el_left_input;
  const el_answer = props.el_answer;
  const kigo = props.kigo;


  return (
    <div className={styles.place}>
      <input ref={el_left_input} className={styles.input} type="number" name="number" max="20" min="0" step="1"/>

      <span className={styles.kigo}>{kigo}</span>
      
      <input ref={el_right_input} className={styles.input} type="number" name="number" max="20" min="0" step="1" />
      
      <span className={styles.kigo}>＝</span>
      
      <input ref={el_answer} className={styles.input} type="number" name="number" max="40" min="0" step="1"/>
    </div>
  );
}
