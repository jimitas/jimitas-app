import { useState, useRef, FC } from "react";
import LinksForPopup from "src/components/Links/LinksForPopup";
import styles from "src/components/Popupmenu/Popupmenu.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";
import * as se from "src/components/se";

// ポップアップメニューコンポーネント（jimitas-next14版：レスポンシブ対応改善）
export const PopupMenu: FC = () => {
  const [isShown, setIsShown] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const handleToggleButtonClick = () => {
    se.set.play();
    setIsShown(true);
  };

  const handleCloseButtonClick = () => {
    se.set.play();
    setIsShown(false);
  };

  return (
    <div className="w-12" onClick={isShown ? handleCloseButtonClick : handleToggleButtonClick}>
      <FontAwesomeIcon
        className="relative w-12 h-6 md:h-7 lg:h-8 text-orange-500 cursor-pointer hover:opacity-80 hover:transition duration-300"
        icon={faList}
      />

      <div className={isShown ? styles.popupMenuShown : styles.popupMenu} ref={popupRef}>
        <FontAwesomeIcon
          className="w-12 h-6 md:h-7 lg:h-8 text-orange-500 cursor-pointer hover:opacity-80 hover:transition duration-300"
          icon={faWindowClose}
          onClick={handleCloseButtonClick}
        />
        <LinksForPopup />
      </div>
    </div>
  );
};
