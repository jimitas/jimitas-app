
import { Howl } from "howler";
import * as sound from "src/components/se";
import styles from "src/components/Kenban/kenban.module.css";
import React from "react";

const ITEMS_WH_INDEX = [1, 3, 5, 7, 8, 10, 12, 13, 15, 17, 19, 20, 22, 24, 25, 27, 29, 31, 32, 34];
const ITEMS_BK_NOTE = [
  "#ﾌｧ/♭ソ",
  "#ソ/♭ラ",
  "#ラ/♭シ",
  "",
  "#ド/♭レ",
  "#レ/♭ミ",
  "",
  "#ﾌｧ/♭ソ",
  "#ソ/♭ラ",
  "#ラ/♭シ",
  "",
  "#ド/♭レ",
  "#レ/♭ミ",
  "",
  "#ﾌｧ/♭ソ",
  "#ソ/♭ラ",
  "#ラ/♭シ",
  "",
  "#ド/♭レ",
];
const ITEMS_WH_NOTE = [
  "ﾌｧ",
  "ソ",
  "ラ",
  "シ",
  "ド",
  "レ",
  "ミ",
  "ﾌｧ",
  "ソ",
  "ラ",
  "シ",
  "ド",
  "レ",
  "ミ",
  "ﾌｧ",
  "ソ",
  "ラ",
  "シ",
  "ド",
  "レ",
];
const ITEMS_BK_LABEL = ["X", "V", "N", , "W", "E", , "T", "Y", "U", , "O", "P", , "[", "6", "8", , "-"];
const ITEMS_WH_LABEL = [
  "Z",
  "C",
  "B",
  "M",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  ";",
  ":",
  "]",
  "7",
  "9",
  "0",
  "^",
];
const ITEMS_BK_INDEX = [2, 4, 6, 91, 9, 11, 92, 14, 16, 18, 93, 21, 23, 94, 26, 28, 30, 95, 33];
const ITEMS_BK_CLASS = [
  "BK",
  "BK",
  "BK",
  "None",
  "BK",
  "BK",
  "None",
  "BK",
  "BK",
  "BK",
  "None",
  "BK",
  "BK",
  "None",
  "BK",
  "BK",
  "BK",
  "None",
  "BK",
];
const KEY_CODE = [
  "",
  "KeyZ",
  "KeyX",
  "KeyC",
  "KeyV",
  "KeyB",
  "KeyN",
  "KeyM",
  "KeyA",
  "KeyW",
  "KeyS",
  "KeyE",
  "KeyD",
  "KeyF",
  "KeyT",
  "KeyG",
  "KeyY",
  "KeyH",
  "KeyU",
  "KeyJ",
  "KeyK",
  "KeyO",
  "KeyL",
  "KeyP",
  "Semicolon",
  "Quote",
  "BracketRight",
  "Backslash",
  "Digit6",
  "Digit7",
  "Digit8",
  "Digit9",
  "Digit0",
  "Minus",
  "Equal",
];


interface KenbanProps {
  gakki: string;
}

interface KeyInfo {
  index: number;
  note: string;
  label: string;
  class: string;
}

const W_KEY: KeyInfo[] = [];
for (let i = 0; i < ITEMS_WH_INDEX.length; i++) {
  W_KEY[i] = {
    index: ITEMS_WH_INDEX[i],
    note: ITEMS_WH_NOTE[i],
    label: ITEMS_WH_LABEL[i],
    class: "WH",
  };
}

const B_KEY: KeyInfo[] = [];
for (let i = 0; i < ITEMS_BK_INDEX.length; i++) {
  B_KEY[i] = {
    index: ITEMS_BK_INDEX[i],
    note: ITEMS_BK_NOTE[i],
    label: ITEMS_BK_LABEL[i] ?? "",
    class: ITEMS_BK_CLASS[i],
  };
}

export function Kenban(props: KenbanProps) {
  let gakki = "ke-";

  switch (props.gakki) {
    case "けんばんハーモニカ":
      gakki = "ke-";
      break;
    case "リコーダー":
      gakki = "re_";
      break;
    case "もっきん":
      gakki = "mo_";
      break;
    case "てっきん":
      gakki = "te_";
      break;
  }

  // インスタンスを生成

  const se: Howl[] = ["" as unknown as Howl];
  let keyDownResult = 0;
  const Key_flag: boolean[] = [];

  for (let i = 1; i <= 34; i++) {
    se[i] = new Howl({
      src: [`Sounds/${gakki}${i}.mp3`],
      preload: true,
      volume: 1.0,
      loop: false,
      autoplay: false,
    });
    Key_flag[i] = false;
  }

  //何のキーが押されたかを判定してコードを返す
  const check_code = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    keyDownResult = KEY_CODE.indexOf(e.code);
    return keyDownResult;
  };

  const Play_BK = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const index = ITEMS_BK_INDEX.indexOf(Number((e.target as HTMLElement).id));
    se[ITEMS_BK_INDEX[index]].play();
  };

  const Pause_BK = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const index = ITEMS_BK_INDEX.indexOf(Number((e.target as HTMLElement).id));
    se[ITEMS_BK_INDEX[index]].pause();
    se[ITEMS_BK_INDEX[index]].seek(0);
  };

  const Play_WH = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const index = ITEMS_WH_INDEX.indexOf(Number((e.target as HTMLElement).id));
    se[ITEMS_WH_INDEX[index]].play();
  };

  const Pause_WH = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const index = ITEMS_WH_INDEX.indexOf(Number((e.target as HTMLElement).id));
    se[ITEMS_WH_INDEX[index]].pause();
    se[ITEMS_WH_INDEX[index]].seek(0);
  };

  const KeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    check_code(e);
    if (!Key_flag[keyDownResult]) {
      Key_flag[keyDownResult] = true;
      se[keyDownResult].play();
      const elem = document.getElementById(String(keyDownResult));
      if (elem) elem.style.backgroundColor = "rgba(252, 165, 165)";
    }
  };

  const KeyUp = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    check_code(e);
    if (Key_flag[keyDownResult]) {
      Key_flag[keyDownResult] = false;
      se[keyDownResult].pause();
      se[keyDownResult].seek(0);
      const elem = document.getElementById(String(keyDownResult));
      if (elem) elem.style.backgroundColor = "";
    }
  };

  return (
    <div>
      <button
        type="button"
        className={styles.btn}
        onClick={() => {
          sound.set.play();
        }}
        onKeyDown={KeyDown}
        onKeyUp={KeyUp}
      >
        キーボード入力ON
      </button>

      <div className="relative key_place">
        <div className="absolute top-8 left-2.5 md:left-5 flex justify-center">
          {B_KEY.map((B_KEY) => (
            <div
              key={B_KEY.index}
              id={String(B_KEY.index)}
              className={B_KEY.class}
              onMouseDown={Play_BK}
              onTouchStart={Play_BK}
              onMouseUp={Pause_BK}
              onTouchEnd={Pause_BK}
            >
              {B_KEY.note}
              <br />
              {B_KEY.label}
            </div>
          ))}
        </div>
        <div className="absolute top-8 flex justify-center">
          {W_KEY.map((W_KEY) => (
            <div
              key={W_KEY.index}
              id={String(W_KEY.index)}
              className="WH"
              onMouseDown={Play_WH}
              onTouchStart={Play_WH}
              onMouseUp={Pause_WH}
              onTouchEnd={Pause_WH}
            >
              {W_KEY.note}
              <br />
              {W_KEY.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
