import * as se from "src/components/se";
import Link from "next/link";
import styles from "src/components/Header/header.module.css";
import router from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo, faHome, faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { PopupMenu } from "../Popupmenu";

// ヘッダーコンポーネント（jimitas-next14版：シンプル・レスポンシブ対応）
export function Header() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  // 目に負担がかからないために、連打できない設定にする。
  useEffect(() => {
    if (!isButtonDisabled) return;

    const timer = setTimeout(() => {
      setIsButtonDisabled(false);
    }, 500); // ボタンの無効化時間（ミリ秒）

    return () => clearTimeout(timer);
  }, [isButtonDisabled]);

  const handleToggle = () => {
    if (isButtonDisabled) {
      se.alertSound.play();
      alert("ボタンの連打は無効です。");
    } else {
      se.set.play();
    }
    setIsDarkMode(!isDarkMode);
    setIsButtonDisabled(true);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.style.color = "white";
      document.body.style.backgroundColor = "black";
    } else {
      document.body.style.color = "black";
      document.body.style.backgroundColor = "white";
    }
  }, [isDarkMode]);

  const reload = () => {
    se.set.play();
    const result = window.confirm("もういちど　ページを　よみこみますか？");
    if (result === false) return;
    location.reload();
  };

  const back = () => {
    se.set.play();
    const result = window.confirm("まえの　ページに　もどりますか？");
    if (result === false) return;
    router.back();
  };

  return (
    <header className="flex flex-start w-screen ps-2 h-8 md:h-10 lg:h-12 xl:h-14 border-b items-center absolute top-0 z-50">
      <Link href="./">
        <FontAwesomeIcon
          icon={faHome}
          className="w-14 h-6 md:h-7 lg:h-8 text-red-400 cursor-pointer hover:opacity-80 hover:transition duration-300"
        />
      </Link>

      <FontAwesomeIcon
        onClick={back}
        icon={faLongArrowAltLeft}
        className="w-12 h-6 md:h-7 lg:h-8 text-orange-300 cursor-pointer hover:opacity-80 hover:transition duration-300"
      />

      <FontAwesomeIcon
        onClick={reload}
        icon={faUndo}
        className="w-12 h-6 md:h-7 lg:h-8 text-blue-500 cursor-pointer hover:opacity-80 hover:transition duration-300"
      />

      <form action="#" className="w-12 text-center">
        <label className={styles.switch}>
          <input type="checkbox" onChange={handleToggle}></input>
          <span className={styles.slider}></span>
        </label>
      </form>

      <PopupMenu />
    </header>
  );
}
