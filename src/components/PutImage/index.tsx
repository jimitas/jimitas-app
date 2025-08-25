import styles from "src/components/PutImage/putImage.module.css";

interface PutImageProps {
  el_img: React.RefObject<HTMLDivElement>;
}

export function PutImage(props: PutImageProps) {
  const el_img = props.el_img;
  return (
    <div className="w-full flex justify-center items-center">
      <div ref={el_img} className="my-3 h-12 md:h-16 xl:h-20 2xl:h-24 container flex justify-center items-center flex-wrap bg-blue-100">
      </div>
    </div>
  );
}
