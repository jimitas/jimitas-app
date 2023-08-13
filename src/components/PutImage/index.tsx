import styles from "src/components/PutImage/putImage.module.css";

interface PutImageProps {
  el_img: React.RefObject<HTMLDivElement>;
}

export function PutImage(props:PutImageProps) {
  const el_img = props.el_img;
  return <div ref={el_img} className={styles.imgPlace}></div>;
}
