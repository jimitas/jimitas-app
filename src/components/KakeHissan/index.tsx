import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import styles from "./kakeHissan.module.css";
import * as se from "src/components/se";
import { useDragDrop } from "src/hooks/useDragDrop";

interface KakeHissanProps { }

// 問題モードの定義
const QUESTION_MODES = [
  "(２けた)×(１けた)",
  "(３けた)×(１けた)",
  "(２けた)×(２けた)",
  "(３けた)×(２けた)",
  "小数(○.○)×(１けた)",
  "小数(○.○○)×(１けた)",
  "小数(○.○)×(２けた)",
  "小数(○.○○)×(２けた)",
  "小数(○.○)×小数(○.○)",
  "小数(○.○○)×小数(○.○)",
];

// 設定データ
const multiplicandDigit = [2, 3, 2, 3, 2, 3, 2, 3, 2, 3]; // 被乗数の桁数
const multiplierDigit = [1, 1, 2, 2, 1, 1, 2, 2, 2, 2]; // 乗数の桁数
const multiplicandDigitRatio = [1, 1, 1, 1, 10, 100, 10, 100, 10, 100]; // 被乗数の小数化へのレート
const multiplierDigitRatio = [1, 1, 1, 1, 1, 1, 1, 1, 10, 10]; // 乗数の小数化へのレート

const KakeHissan: React.FC<KakeHissanProps> = () => {
  // State管理
  const [selectIndex, setSelectIndex] = useState(0);
  const [multiplicandNumber, setMultiplicandNumber] = useState(0);
  const [multiplierNumber, setMultiplierNumber] = useState(0);
  const [collectAnswer, setCollectAnswer] = useState(0);
  const [multiplicandNumberArray, setMultiplicandNumberArray] = useState<string[]>([]);
  const [multiplierNumberArray, setMultiplierNumberArray] = useState<string[]>([]);
  const [collectAnswerArray, setCollectAnswerArray] = useState<string[]>([]);
  const [myAnswer, setMyAnswer] = useState(0);
  const [mondaiFlag, setMondaiFlag] = useState(false);
  const [hintFlag, setHintFlag] = useState(false);
  const [pointFlag, setPointFlag] = useState(false);
  const [answerFlag, setAnswerFlag] = useState(false);
  const [scoreCount, setScoreCount] = useState(0);
  const [count, setCount] = useState(0);

  // テーブルデータの管理（8行9列）
  const [tableData, setTableData] = useState<string[][]>(
    Array(8).fill(null).map(() => Array(9).fill(""))
  );

  const tableRef = useRef<HTMLTableElement>(null);

  // ドロップ時にカウントを更新するコールバック
  const handleDropCallback = () => {
    setCount((prev) => prev + 1);
    myAnswerUpdate();
    // 元のコードのようにnumberSetを呼んで数字パレットを再生成
    setTimeout(() => {
      numberSet();
    }, 10);
  };

  // カスタムフックからドラッグ&ドロップ機能を取得
  const { dragStart, dragOver, dropEnd, touchStart, touchMove, touchEnd } = useDragDrop(handleDropCallback);

  // 答え更新
  const myAnswerUpdate = () => {
    const table = tableRef.current;
    if (!table) return;

    let newMyAnswer = 0;
    let ratio = 1;

    // テーブルから直接値を読み取り（DOM操作）
    const row7 = table.rows[7];
    if (!row7) return;

    // 小数点の位置によってレートを決める
    for (let j = 0; j < 3; j++) {
      const decimalCell = row7.cells[j * 2 + 3];
      if (decimalCell && decimalCell.textContent === ".") {
        ratio = 10 ** (3 - j);
      }
    }

    // 答えの行から数字を読み取り
    for (let j = 0; j < 5; j++) {
      const cell = row7.cells[j * 2];
      if (cell && cell.textContent && !isNaN(Number(cell.textContent))) {
        newMyAnswer += Number(cell.textContent) * 10 ** (4 - j);
      }
    }
    newMyAnswer /= ratio;
    setMyAnswer(newMyAnswer);
  };

  // テーブル書き換え
  const rewriteTable = useCallback(() => {
    // まずDOM上の既存の数字要素を完全にクリア
    const table = tableRef.current;
    if (table) {
      // すべての行のセルから.num要素を削除
      for (let row = 0; row < 8; row++) {
        if (table.rows[row]) {
          const cells = table.rows[row].querySelectorAll('td');
          cells.forEach((cell) => {
            // ドロップされた数字要素（.num）を削除
            const numElements = cell.querySelectorAll('.num');
            numElements.forEach(num => num.remove());
          });
        }
      }
    }

    // テーブルをクリア
    const newTableData = Array(8).fill(null).map(() => Array(9).fill(""));

    // 被乗数の挿入
    if (multiplicandNumberArray.length > 0) {
      let addCol = multiplicandDigit[selectIndex] === 2 ? 5 : 3;
      for (let j = 0; j < multiplicandNumberArray.length; j++) {
        if (multiplicandNumberArray[j] === ".") {
          newTableData[0][j * 2 + addCol] = multiplicandNumberArray[j];
          addCol = addCol - 2;
        } else {
          newTableData[0][j * 2 + addCol + 1] = multiplicandNumberArray[j];
        }
      }
    }

    // 乗数の挿入
    if (multiplierNumberArray.length > 0) {
      let addCol = multiplierDigit[selectIndex] === 1 ? 7 :
        multiplierDigit[selectIndex] === 2 ? 5 : 3;
      for (let j = 0; j < multiplierNumberArray.length; j++) {
        if (multiplierNumberArray[j] === ".") {
          newTableData[1][j * 2 + addCol] = multiplierNumberArray[j];
          addCol = addCol - 2;
        } else {
          newTableData[1][j * 2 + addCol + 1] = multiplierNumberArray[j];
        }
      }
    }

    // ×の位置の挿入
    if (selectIndex % 2 === 0) {
      newTableData[1][4] = "×";
    } else {
      newTableData[1][2] = "×";
    }

    setTableData(newTableData);
  }, [selectIndex, multiplicandNumberArray, multiplierNumberArray]);

  // テーブルレイアウト調整
  const adjustTableLayout = useCallback(() => {
    const table = tableRef.current;
    if (!table) return;

    const rows = table.querySelectorAll('tr');

    // 小数点部分の罫線レイアウト調整
    for (let i = 0; i < 8; i++) {
      if (rows[i]) {
        const cells = rows[i].querySelectorAll('td');
        if (cells[3]) {
          (cells[3] as HTMLElement).style.borderLeft = selectIndex < 4 ? "none" : "dotted gray 1px";
          (cells[3] as HTMLElement).style.width = selectIndex < 4 ? "0px" : "10px";
        }
        if (cells[5]) {
          (cells[5] as HTMLElement).style.borderLeft = selectIndex < 4 ? "none" : "dotted gray 1px";
          (cells[5] as HTMLElement).style.width = selectIndex < 4 ? "0px" : "10px";
        }
        if (cells[7]) {
          (cells[7] as HTMLElement).style.borderLeft = selectIndex < 4 ? "none" : "dotted gray 1px";
          (cells[7] as HTMLElement).style.width = selectIndex < 4 ? "0px" : "10px";
        }
      }
    }

    // かける数の桁数によるレイアウト調整
    if (multiplierDigit[selectIndex] === 1) {
      // 1桁の場合：中間計算行を非表示
      for (let i = 2; i < 6; i++) {
        if (rows[i]) {
          const cells = rows[i].querySelectorAll('td');
          cells.forEach((cell) => {
            (cell as HTMLElement).style.height = "0px";
            (cell as HTMLElement).style.borderBottom = "none";
            (cell as HTMLElement).style.padding = "0";
          });
        }
      }
    } else {
      // 2桁の場合：中間計算行を表示
      const styleHeight = ["20px", "max(50px, 4vw)", "20px", "max(50px, 4vw)"];
      const styleBorder = ["dotted gray 1px", "dotted gray 1px", "dotted gray 1px", "solid black 1px"];

      for (let i = 2; i < 6; i++) {
        if (rows[i]) {
          const cells = rows[i].querySelectorAll('td');
          cells.forEach((cell) => {
            (cell as HTMLElement).style.height = styleHeight[i - 2];
            (cell as HTMLElement).style.borderBottom = styleBorder[i - 2];
            (cell as HTMLElement).style.padding = "";
          });
        }
      }
    }
  }, [selectIndex]);

  // 数字パレットの作成
  const numberSet = useCallback(() => {
    // 数字パレット内の数字を一旦消去
    const numPalletElement = document.getElementById("num-pallet");
    if (numPalletElement) {
      while (numPalletElement.firstChild) {
        numPalletElement.removeChild(numPalletElement.firstChild);
      }

      for (let i = 0; i < 10; i++) {
        const div = document.createElement("div");
        div.innerHTML = String(i);

        // CSS Modulesのクラス名を確実に適用
        div.className = `${styles.num} draggable-elem`;
        div.setAttribute("draggable", "true");

        // タッチイベントのみdiv要素に追加（マウスイベントはdocumentレベルで処理）
        div.addEventListener("touchstart", touchStart, false);
        div.addEventListener("touchmove", touchMove, false);
        div.addEventListener("touchend", touchEnd, false);

        if (i === 0) {
          div.addEventListener("click", () => {
            if (div.classList.contains("diagonal")) {
              div.classList.remove("diagonal");
            } else {
              div.classList.add("diagonal");
            }
          });
        }

        numPalletElement.appendChild(div);
      }
    }
  }, [touchStart, touchMove, touchEnd]);

  // 初期化
  useEffect(() => {
    // セレクト変更時はテーブルをクリアして初期化
    if (multiplicandNumberArray.length === 0 && multiplierNumberArray.length === 0) {
      const clearedTableData = Array(8).fill(null).map(() => Array(9).fill(""));
      setTableData(clearedTableData);
    } else {
      rewriteTable();
    }
    numberSet();
  }, [selectIndex, multiplicandNumberArray, multiplierNumberArray, rewriteTable, numberSet]);

  // セレクトボックス変更時のレイアウト調整
  useEffect(() => {
    const timer = setTimeout(() => {
      adjustTableLayout();
    }, 100); // DOM更新後に実行

    return () => clearTimeout(timer);
  }, [selectIndex, adjustTableLayout]);

  // ウィンドウサイズ変更時の数字パレットサイズ調整
  useEffect(() => {
    const handleResize = () => {
      numberSet();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [numberSet]);

  // DOM操作とイベントリスナーの設定
  useEffect(() => {
    const currentTable = tableRef.current;

    const setupTableEvents = () => {
      if (!currentTable) return;

      // テーブルセルにdroppable-elemクラスを追加（イベントはdocumentレベルで処理）
      const cells = currentTable.querySelectorAll('td');
      cells.forEach((cell, index) => {
        const row = Math.floor(index / 9);

        if (row > 1) {
          cell.classList.add('droppable-elem');
        }
      });
    };

    // ゴミ箱は既にdroppable-elemクラスが付いているので、イベントはdocumentレベルで処理される

    setupTableEvents();
    numberSet();

    // 他のコンポーネントと同様にdocumentレベルでマウスドラッグイベントを追加
    document.addEventListener("dragstart", dragStart as EventListener, false);
    document.addEventListener("dragover", dragOver as EventListener, false);
    document.addEventListener("drop", dropEnd as EventListener, false);

    return () => {
      // documentレベルのイベントリスナーをクリーンアップ
      document.removeEventListener("dragstart", dragStart as EventListener, false);
      document.removeEventListener("dragover", dragOver as EventListener, false);
      document.removeEventListener("drop", dropEnd as EventListener, false);
    };
  }, [count, selectIndex, dragStart, dragOver, dropEnd, numberSet]);

  // セレクトボックス変更時
  const handleSelectChange = (value: number) => {
    se.move2.play();
    setSelectIndex(value);

    // セレクト変更時に状態をリセット
    setMondaiFlag(false);
    setHintFlag(false);
    setPointFlag(false);
    setAnswerFlag(false);
    setMultiplicandNumber(0);
    setMultiplierNumber(0);
    setMultiplicandNumberArray([]);
    setMultiplierNumberArray([]);
    setCollectAnswerArray([]);
    setMyAnswer(0);
    setCount(0);

    // テーブルをクリア
    const clearedTableData = Array(8).fill(null).map(() => Array(9).fill(""));
    setTableData(clearedTableData);

    // DOM上の答えとヒントもクリア（次の問題選択時）
    setTimeout(() => {
      clearAnswerAndHint();
    }, 50);
  };

  // 問題作成
  const questionCreate = () => {
    setMondaiFlag(true);
    setHintFlag(false);
    se.set.play();

    // 初期化（問題作成時は答えとヒントをクリア）
    setMultiplicandNumber(0);
    setMultiplierNumber(0);
    setMultiplicandNumberArray([]);
    setMultiplierNumberArray([]);
    setCollectAnswerArray([]);
    setHintFlag(false);
    setAnswerFlag(false);

    // 被乗数の決定
    let newMultiplicandNumber = 0;
    for (let i = 0; i < multiplicandDigit[selectIndex]; i++) {
      if ((selectIndex < 4 && i === multiplicandDigit[selectIndex] - 1) ||
        (selectIndex >= 4 && i === 0)) {
        newMultiplicandNumber += Math.floor(Math.random() * 9 + 1) * 10 ** i;
      } else {
        newMultiplicandNumber += Math.floor(Math.random() * 10) * 10 ** i;
      }
    }
    newMultiplicandNumber /= multiplicandDigitRatio[selectIndex];
    setMultiplicandNumber(newMultiplicandNumber);
    const newMultiplicandArray = String(newMultiplicandNumber).split("");
    setMultiplicandNumberArray(newMultiplicandArray);

    // 乗数の決定
    let newMultiplierNumber = 0;
    for (let i = 0; i < multiplierDigit[selectIndex]; i++) {
      if ((selectIndex < 8 && i === multiplierDigit[selectIndex] - 1) ||
        (selectIndex >= 8 && i === 0)) {
        newMultiplierNumber += Math.floor(Math.random() * 9 + 1) * 10 ** i;
      } else {
        newMultiplierNumber += Math.floor(Math.random() * 10) * 10 ** i;
      }
    }
    newMultiplierNumber /= multiplierDigitRatio[selectIndex];
    setMultiplierNumber(newMultiplierNumber);
    const newMultiplierArray = String(newMultiplierNumber).split("");
    setMultiplierNumberArray(newMultiplierArray);

    // 答えの決定
    const newCollectAnswer = newMultiplicandNumber * newMultiplierNumber;
    const ratio = multiplicandDigitRatio[selectIndex] * multiplicandDigitRatio[selectIndex];
    const adjustedAnswer = Math.round(newCollectAnswer * ratio) / ratio;
    setCollectAnswer(adjustedAnswer);
    const newCollectAnswerArray = String(adjustedAnswer).split("");
    setCollectAnswerArray(newCollectAnswerArray);

    // DOM上の答えとヒントをクリア（問題作成時）
    setTimeout(() => {
      clearAnswerAndHint();
    }, 50);

    // テーブルを更新
    rewriteTable();
  };

  // 小数点クリック
  const handleDecimalClick = (col: number) => {
    se.move1.play();
    const newTableData = [...tableData];

    if (!pointFlag) {
      newTableData[7][col] = ".";
      setPointFlag(true);
    } else {
      if (tableData[7][col] === ".") {
        newTableData[7][col] = "";
        setPointFlag(false);
      } else {
        // 他の小数点をクリア
        newTableData[7][3] = "";
        newTableData[7][5] = "";
        newTableData[7][7] = "";
        newTableData[7][col] = ".";
      }
    }
    setTableData(newTableData);
  };

  // DOM上の答えとヒントをクリア
  const clearAnswerAndHint = () => {
    const table = tableRef.current;
    if (!table) return;

    // ヒント部分をクリア（3行目、5行目）
    for (let row = 3; row <= 5; row += 2) {
      if (table.rows[row]) {
        const cells = table.rows[row].querySelectorAll('td');
        cells.forEach((cell) => {
          if (cell.textContent && cell.textContent !== "×") {
            cell.textContent = "";
          }
          // ドロップされた数字要素も削除
          const numElements = cell.querySelectorAll('.num');
          numElements.forEach(num => num.remove());
        });
      }
    }

    // 答え部分をクリア（7行目）
    if (table.rows[7]) {
      const cells = table.rows[7].querySelectorAll('td');
      cells.forEach((cell, index) => {
        // 小数点以外をクリア
        if (cell.textContent && cell.textContent !== "." && index !== 3 && index !== 5 && index !== 7) {
          cell.textContent = "";
        }
        // ドロップされた数字要素も削除（小数点以外の列）
        if (index !== 3 && index !== 5 && index !== 7) {
          const numElements = cell.querySelectorAll('.num');
          numElements.forEach(num => num.remove());
        }
      });
    }
  };

  // 消すボタン
  const handleClear = () => {
    rewriteTable();
    setHintFlag(false);
    setAnswerFlag(false);
    clearAnswerAndHint();
    se.reset.play();
  };

  // 答えを見る
  const showAnswer = () => {
    if (!mondaiFlag) {
      se.alertSound.play();
      alert("「問題」をおしてください。");
      return;
    }
    se.seikai2.play();
    answerWrite();
    // 答え表示フラグを設定（すぐに消えないように）
    setAnswerFlag(true);
  };

  // ヒント部分のみをクリア（DOM直接操作）
  const clearHintOnly = () => {
    const table = tableRef.current;
    if (!table) return;

    // ヒント部分をクリア（3行目、5行目）
    for (let row = 3; row <= 5; row += 2) {
      if (table.rows[row]) {
        const cells = table.rows[row].querySelectorAll('td');
        cells.forEach((cell) => {
          if (cell.textContent && cell.textContent !== "×") {
            cell.textContent = "";
          }
          // ドロップされた数字要素も削除
          const numElements = cell.querySelectorAll('.num');
          numElements.forEach(num => num.remove());
        });
      }
    }
  };

  // ヒント
  const handleHint = () => {
    if (!mondaiFlag) {
      se.alertSound.play();
      alert("「問題」をおしてください。");
      return;
    }
    if (multiplierDigit[selectIndex] === 1) {
      se.alertSound.play();
      alert("かける数が２けたのときにヒントが出されます。");
      return;
    }
    se.seikai1.play();

    if (!hintFlag) {
      // ヒントを表示
      hintWrite();
      setHintFlag(true);
    } else {
      // ヒントを非表示（DOM直接操作でヒント部分のみクリア）
      setHintFlag(false);
      clearHintOnly();
    }
  };

  // ヒント記述（元のコードのようにDOM直接操作）
  const hintWrite = () => {
    const table = tableRef.current;
    if (!table || multiplierDigit[selectIndex] === 1) return;

    // 筆算のため、レートをかけて整数化
    const numA = multiplicandNumber * multiplicandDigitRatio[selectIndex];
    const numB = multiplierNumber * multiplierDigitRatio[selectIndex];

    // 筆算１段目の記述
    const partOfAnswer1 = Math.round(numA * (numB % 10));
    const partOfAnswer1Array = String(partOfAnswer1).split("");
    let addCol = 10 - 2 * partOfAnswer1Array.length;
    for (let j = 0; j < partOfAnswer1Array.length; j++) {
      const cell = table.rows[3].cells[j * 2 + addCol];
      if (cell) {
        cell.textContent = partOfAnswer1Array[j];
      }
    }

    // 筆算２段目の記述
    const partOfAnswer2 = Math.round(numA * Math.floor(numB / 10));
    const partOfAnswer2Array = String(partOfAnswer2).split("");
    addCol = 8 - 2 * partOfAnswer2Array.length;
    for (let j = 0; j < partOfAnswer2Array.length; j++) {
      const cell = table.rows[5].cells[j * 2 + addCol];
      if (cell) {
        cell.textContent = partOfAnswer2Array[j];
      }
    }
  };

  // 答え記述（元のコードのようにDOM直接操作）
  const answerWrite = () => {
    const table = tableRef.current;
    if (!table) return;

    // ヒントも表示する
    hintWrite();

    const answerLength = collectAnswerArray.length;
    const DecimalPointCol = [9, 9, 9, 9, 7, 5, 7, 5, 5, 3];

    // 小数を含む掛け算の場合、小数点を答えに記す
    if (DecimalPointCol[selectIndex] !== 9) {
      const decimalCell = table.rows[7].cells[DecimalPointCol[selectIndex]];
      if (decimalCell) {
        decimalCell.textContent = ".";
      }
    }

    // 小数点が何番目に登場するかを調べて整数部分の桁数を得る
    const searchDecimalPoint = collectAnswerArray.indexOf(".") === -1 ? answerLength : collectAnswerArray.indexOf(".");

    // 何列目から数値を書き加えるかの決定
    let addCol = DecimalPointCol[selectIndex] - 2 * searchDecimalPoint + 1;

    // 答えの描画
    for (let j = 0; j < 6; j++) {
      if (collectAnswerArray[j] === ".") {
        addCol = addCol - 2;
      } else if (j < answerLength) {
        const cell = table.rows[7].cells[j * 2 + addCol];
        if (cell) {
          cell.textContent = collectAnswerArray[j];
          cell.classList.remove("diagonal");
        }
      } else if (j * 2 + addCol < 9) {
        const cell = table.rows[7].cells[j * 2 + addCol];
        if (cell) {
          cell.textContent = "0";
        }
      }
    }
  };

  // 答え合わせ
  const checkAnswer = () => {
    myAnswerUpdate();
    if (!mondaiFlag) {
      se.alertSound.play();
      alert("「問題」をおしてください。");
      return;
    }
    if (myAnswer === collectAnswer) {
      se.seikai2.play();
      setScoreCount(prev => prev + 1);
      alert("正解");
      setMondaiFlag(false);
    } else {
      se.alertSound.play();
      alert("もう一度！");
    }
  };

  return (
    <div className={styles.container}>
      {/* 問題選択セクション */}
      <div className={styles.questionSection}>
        <div className={styles.questionLabel}>問題の種類を選んでください。</div>
        <select
          value={selectIndex}
          onChange={(e) => handleSelectChange(Number(e.target.value))}
          className={styles.selectBox}
        >
          {QUESTION_MODES.map((mode, index) => (
            <option key={index} value={index}>
              {mode}
            </option>
          ))}
        </select>
      </div>

      {/* ボタンセクション */}
      <div className={styles.buttonSection}>
        <button onClick={questionCreate} className={`${styles.btn} ${styles.btnDanger}`}>
          問題
        </button>
        <button onClick={checkAnswer} className={`${styles.btn} ${styles.btnPrimary}`}>
          答え合わせ
        </button>
      </div>

      {/* 問題表示 */}
      <div className={styles.textBox}>
        {mondaiFlag && `${multiplicandNumber}×${multiplierNumber}=`}
      </div>

      {/* 筆算テーブル */}
      <div className={`${styles.tableContainer} ${multiplierDigit[selectIndex] === 1 ? styles.singleDigitMultiplier : ""
        } ${selectIndex < 4 ? styles.integerMode : ""
        }`}>
        <table ref={tableRef} className={styles.calcTable}>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex} className={styles[`row${rowIndex}`]}>
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className={`${styles.tableCell} ${rowIndex === 7 && (colIndex === 3 || colIndex === 5 || colIndex === 7)
                      ? styles.decimalClickable
                      : ""
                      } ${rowIndex > 1 ? "droppable-elem" : ""
                      }`}
                    onClick={
                      rowIndex === 7 && (colIndex === 3 || colIndex === 5 || colIndex === 7)
                        ? () => handleDecimalClick(colIndex)
                        : undefined
                    }
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 小数点注意メッセージ */}
      {selectIndex >= 4 && (
        <div className={styles.infoText}>小数点はクリックすると出ます。</div>
      )}

      {/* 数字パレットとゴミ箱 */}
      <div className={styles.paletteSection}>
        <div className={styles.spacer}></div>
        <div id="num-pallet" className={`${styles.numPallet} droppable-elem`}></div>
        <div className={styles.trashSection}>
          <Image
            src="/images/gomibako.png"
            alt="ゴミ箱"
            width={60}
            height={80}
            className={`${styles.trashIcon} droppable-elem`}
            style={{ cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* 下部ボタン */}
      <div className={styles.buttonSection}>
        <button onClick={showAnswer} className={`${styles.btn} ${styles.btnSuccess}`}>
          答えを見る
        </button>
        <button onClick={handleClear} className={`${styles.btn} ${styles.btnSecondary}`}>
          消す
        </button>
        <button onClick={handleHint} className={`${styles.btn} ${styles.btnInfo}`}>
          ヒント
        </button>
      </div>

      {/* スコア表示 */}
      <div className={styles.scoreSection}>
        {Array.from({ length: scoreCount }, (_, i) => (
          <Image key={i} src="/images/coin.png" alt="コイン" width={50} height={50} className={styles.scoreIcon} />
        ))}
      </div>
    </div>
  );
};

export default KakeHissan;