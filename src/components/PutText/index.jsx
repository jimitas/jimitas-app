import styles from "src/components/PutText/putText.module.css";
export function PutText(props) {
  const el_text = props.el_text;
  return (
    <div>
      <div ref={el_text} className={styles.textBox}></div>
    </div>
  );
}
