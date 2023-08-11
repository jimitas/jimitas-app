"use client";
import Link from "next/link";
import { faUndo, faHome, faPalette, faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import styles from "src/components/Header/header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import router from "next/router";
import * as se from "src/components/se";

const index = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isDarkMode, setIsDarkMode] = useState(false);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (isDarkMode) {
      document.body.style.color = "white";
      document.body.style.backgroundColor = "black";
    } else {
      document.body.style.color = "black";
      document.body.style.backgroundColor = "white";
    }
  }, [isDarkMode]);

  const handleToggle = () => {
    setIsDarkMode(!isDarkMode);
    se.set.play();
  };

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
    <header className="flex w-screen h-16 border-b items-center select-none">
      <Link href="./" className="h-16 flex items-center">
        {/* ジミタスのロゴをつけるといい感じkamo
         */}
        <FontAwesomeIcon icon={faHome} className="w-12 h-12 mx-5 text-red-300 font-bold cursor-pointer" />
      </Link>

      <form action="#">
        <label className={styles.switch}>
          <input type="checkbox" onChange={handleToggle}></input>
          <span className={styles.slider}></span>
        </label>
      </form>

      <div onClick={back}>
        <FontAwesomeIcon
          icon={faLongArrowAltLeft}
          className="w-12 h-12 mx-5 text-yellow-400 font-bold cursor-pointer"
        />
      </div>

      <div onClick={reload}>
        <FontAwesomeIcon icon={faUndo} className="w-12 h-12 mr-5 text-blue-500 font-bold cursor-pointer" />
      </div>
      {/* 後ほどホップアップメニューを実装する。 */}
      {/* <PopupMenu /> */}
    </header>
  );
};

export default index;
