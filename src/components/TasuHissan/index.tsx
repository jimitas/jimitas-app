// components/TasuHissan/index.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import styles from "./tasuHissan.module.css";
import * as se from "src/components/se";
import { useDragDrop } from "src/hooks/useDragDrop";
import { BtnNum } from "src/components/PutButton/btnNum";
import { BtnCheck } from "src/components/PutButton/btnCheck";
import { BtnQuestion } from "src/components/PutButton/btnQuestion";
import { BtnUndo } from "src/components/PutButton/btnUndo";

interface TasuHissanProps {}

// 問題タイプの定義
const QUESTION_TYPES = [
  "(２けた)+(２けた)",
  "(３けた)+(２けた)",
  "(２けた)+(３けた)",
  "(３けた)+(３けた)",
];

const TasuHissan: React.FC<TasuHissanProps> = () => {
  // State管理
  const [selectIndex, setSelectIndex] = useState(0);
  const [leftNumber, setLeftNumber] = useState(0);
  const [rightNumber, setRightNumber] = useState(0);
  const [answer, setAnswer] = useState(0);
  const [leftNumberArray, setLeftNumberArray] = useState<number[]>([]);
  const [rightNumberArray, setRightNumberArray] = useState<number[]>([]);
  const [answerArray, setAnswerArray] = useState<number[]>([]);
  const [myAnswer, setMyAnswer] = useState(0);
  const [mondaiFlag, setMondaiFlag] = useState(false);
  const [count, setCount] = useState(0);

  // テーブルデータの管理（4行4列）
  const [tableData, setTableData] = useState<string[][]>(
    Array(4).fill(null).map(() => Array(4).fill(""))
  );

  // お金テーブルデータの管理（4行4列）
  const [moneyTableData, setMoneyTableData] = useState<string[][]>(
    Array(4).fill(null).map(() => Array(4).fill(""))
  );

  const tableRef = useRef<HTMLTableElement>(null);
  const moneyTableRef = useRef<HTMLTableElement>(null);

  // ドロップ時にカウントを更新するコールバック
  const handleDropCallback = () => {
    setCount((prev) => prev + 1);
    myAnswerUpdate();
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
    const row3 = table.rows[3];
    if (!row3) return;

    for (let j = 0; j < 4; j++) {
      const cell = row3.cells[j];
      if (cell && cell.textContent && !isNaN(Number(cell.textContent))) {
        newMyAnswer += Number(cell.textContent) * 10 ** (3 - j);
      }
    }
    setMyAnswer(newMyAnswer);
  };

  // テーブル書き換え
  const rewriteTable = useCallback(() => {
    // まずDOM上の既存の数字要素を完全にクリア
    const table = tableRef.current;
    if (table) {
      for (let row = 0; row < 4; row++) {
        if (table.rows[row]) {
          const cells = table.rows[row].querySelectorAll('td');
          cells.forEach((cell) => {
            const numElements = cell.querySelectorAll('.num');
            numElements.forEach(num => num.remove());
          });
        }
      }
    }

    // テーブルをクリア
    const newTableData = Array(4).fill(null).map(() => Array(4).fill(""));

    // 左の数の挿入
    if (leftNumberArray.length > 0) {
      for (let j = 0; j < leftNumberArray.length; j++) {
        newTableData[1][4 - leftNumberArray.length + j] = String(leftNumberArray[j]);
      }
    }

    // 右の数の挿入
    if (rightNumberArray.length > 0) {
      for (let j = 0; j < rightNumberArray.length; j++) {
        newTableData[2][4 - rightNumberArray.length + j] = String(rightNumberArray[j]);
      }
    }

    // +の位置の挿入
    if (leftNumber < 100 && rightNumber < 100) {
      newTableData[2][1] = "+";
    } else {
      newTableData[2][0] = "+";
    }

    setTableData(newTableData);
  }, [leftNumberArray, rightNumberArray, leftNumber, rightNumber]);

  // お金テーブル書き換え
  const rewriteMoneyTable = useCallback(() => {
    const newMoneyTableData = Array(4).fill(null).map(() => Array(4).fill(""));

    // 左の数のお金を配置
    for (let col = 0; col < leftNumberArray.length; col++) {
      for (let i = 0; i < leftNumberArray[col]; i++) {
        const coinType = col === 0 ? "ichien" : col === 1 ? "juuen" : "hyakuen";
        newMoneyTableData[1][4 - leftNumberArray.length + col] += coinType + ",";
      }
    }

    // 右の数のお金を配置
    for (let col = 0; col < rightNumberArray.length; col++) {
      for (let i = 0; i < rightNumberArray[col]; i++) {
        const coinType = col === 0 ? "ichien" : col === 1 ? "juuen" : "hyakuen";
        newMoneyTableData[2][4 - rightNumberArray.length + col] += coinType + ",";
      }
    }

    // +の位置の挿入
    if (leftNumber < 100 && rightNumber < 100) {
      newMoneyTableData[2][1] = "+";
    } else {
      newMoneyTableData[2][0] = "+";
    }

    setMoneyTableData(newMoneyTableData);
  }, [leftNumberArray, rightNumberArray, leftNumber, rightNumber]);

  // 数字パレットの作成
  const numberSet = useCallback(() => {
    const numPalletElement = document.getElementById("num-pallet");
    if (numPalletElement) {
      while (numPalletElement.firstChild) {
        numPalletElement.removeChild(numPalletElement.firstChild);
      }

      for (let i = 0; i < 10; i++) {
        const div = document.createElement("div");
        div.innerHTML = String(i);
        div.className = `${styles.num} draggable-elem`;
        div.setAttribute("draggable", "true");

        div.addEventListener("touchstart", touchStart, false);
        div.addEventListener("touchmove", touchMove, false);
        div.addEventListener("touchend", touchEnd, false);

        numPalletElement.appendChild(div);
      }
    }
  }, [touchStart, touchMove, touchEnd]);

  // 初期化
  useEffect(() => {
    if (leftNumberArray.length === 0 && rightNumberArray.length === 0) {
      const clearedTableData = Array(4).fill(null).map(() => Array(4).fill(""));
      setTableData(clearedTableData);
      setMoneyTableData(clearedTableData);
    } else {
      rewriteTable();
      rewriteMoneyTable();
    }
    numberSet();
  }, [leftNumberArray, rightNumberArray, rewriteTable, rewriteMoneyTable, numberSet]);

  // DOM操作とイベントリスナーの設定
  useEffect(() => {
    const currentTable = tableRef.current;
    const currentMoneyTable = moneyTableRef.current;

    const setupTableEvents = () => {
      if (!currentTable) return;

      const cells = currentTable.querySelectorAll('td');
      cells.forEach((cell, index) => {
        const row = Math.floor(index / 4);
        if (row === 0 || row === 3) {
          cell.classList.add('droppable-elem');
        }
      });
    };

    const setupMoneyTableEvents = () => {
      if (!currentMoneyTable) return;

      const cells = currentMoneyTable.querySelectorAll('td');
      cells.forEach((cell) => {
        cell.classList.add('droppable-elem-2');
      });
    };

    setupTableEvents();
    setupMoneyTableEvents();
    numberSet();

    document.addEventListener("dragstart", dragStart as EventListener, false);
    document.addEventListener("dragover", dragOver as EventListener, false);
    document.addEventListener("drop", dropEnd as EventListener, false);

    return () => {
      document.removeEventListener("dragstart", dragStart as EventListener, false);
      document.removeEventListener("dragover", dragOver as EventListener, false);
      document.removeEventListener("drop", dropEnd as EventListener, false);
    };
  }, [selectIndex, dragStart, dragOver, dropEnd, numberSet]);

  // セレクトボックス変更時
  const handleSelectChange = (value: number) => {
    se.move2.play();
    setSelectIndex(value);
    setMondaiFlag(false);
    setLeftNumber(0);
    setRightNumber(0);
    setLeftNumberArray([]);
    setRightNumberArray([]);
    setAnswerArray([]);
    setMyAnswer(0);
    setCount(0);

    const clearedTableData = Array(4).fill(null).map(() => Array(4).fill(""));
    setTableData(clearedTableData);
    setMoneyTableData(clearedTableData);
  };

  // 問題作成
  const questionCreate = () => {
    setMondaiFlag(true);
    se.set.play();

    let newLeftNumber = 0;
    let newRightNumber = 0;

    switch (selectIndex) {
      case 0: // 2桁+2桁
        newLeftNumber = Math.floor(Math.random() * 90 + 10);
        newRightNumber = Math.floor(Math.random() * 90 + 10);
        break;
      case 1: // 3桁+2桁
        newLeftNumber = Math.floor(Math.random() * 900 + 100);
        newRightNumber = Math.floor(Math.random() * 90 + 10);
        break;
      case 2: // 2桁+3桁
        newLeftNumber = Math.floor(Math.random() * 90 + 10);
        newRightNumber = Math.floor(Math.random() * 900 + 100);
        break;
      case 3: // 3桁+3桁
        newLeftNumber = Math.floor(Math.random() * 900 + 100);
        newRightNumber = Math.floor(Math.random() * 900 + 100);
        break;
    }

    setLeftNumber(newLeftNumber);
    setRightNumber(newRightNumber);
    const newAnswer = newLeftNumber + newRightNumber;
    setAnswer(newAnswer);

    // 配列に変換
    const leftArray = String(newLeftNumber).split("").map(Number).reverse();
    const rightArray = String(newRightNumber).split("").map(Number).reverse();
    const answerArray = String(newAnswer).split("").map(Number).reverse();

    setLeftNumberArray(leftArray);
    setRightNumberArray(rightArray);
    setAnswerArray(answerArray);

    rewriteTable();
    rewriteMoneyTable();
  };

  // 消すボタン
  const handleClear = () => {
    rewriteTable();
    rewriteMoneyTable();
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
    
    // くり上がりの表示
    let carry = 0;
    for (let col = 0; col < Math.min(leftNumberArray.length, rightNumberArray.length); col++) {
      const sum = leftNumberArray[col] + rightNumberArray[col] + carry;
      if (sum > 9) {
        const table = tableRef.current;
        if (table && table.rows[0] && table.rows[0].cells[3 - col - 1]) {
          table.rows[0].cells[3 - col - 1].innerHTML = "1";
          table.rows[0].cells[3 - col - 1].style.fontSize = "20px";
          table.rows[0].cells[3 - col - 1].style.color = "red";
          table.rows[0].cells[3 - col - 1].style.verticalAlign = "bottom";
        }
        carry = 1;
      } else {
        carry = 0;
      }
    }

    // 答えの表示
    const table = tableRef.current;
    if (table && table.rows[3]) {
      for (let col = 0; col < answerArray.length; col++) {
        if (table.rows[3].cells[3 - col]) {
          table.rows[3].cells[3 - col].innerHTML = String(answerArray[col]);
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
    if (myAnswer === answer) {
      se.seikai2.play();
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
          {QUESTION_TYPES.map((type, index) => (
            <option key={index} value={index}>
              {type}
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
        <button onClick={showAnswer} className={`${styles.btn} ${styles.btnSuccess}`}>
          答えを見る
        </button>
        <button onClick={handleClear} className={`${styles.btn} ${styles.btnSecondary}`}>
          消す
        </button>
      </div>

      {/* 問題表示 */}
      <div className={styles.textBox}>
        {mondaiFlag && `${leftNumber}+${rightNumber}=`}
      </div>

      {/* 筆算テーブル */}
      <div className={styles.tableContainer}>
        <table ref={tableRef} className={styles.calcTable}>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex} className={styles[`row${rowIndex}`]}>
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className={`${styles.tableCell} ${rowIndex === 0 || rowIndex === 3 ? "droppable-elem" : ""}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* お金テーブル */}
      <div className={styles.moneyTableContainer}>
        <table ref={moneyTableRef} className={styles.moneyTable}>
          <tbody>
            {moneyTableData.map((row, rowIndex) => (
              <tr key={rowIndex} className={styles[`moneyRow${rowIndex}`]}>
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className={`${styles.moneyCell} ${rowIndex === 0 || rowIndex === 3 ? "droppable-elem-2" : ""}`}
                  >
                    {cell && cell !== "+" && cell.split(",").map((coinType, index) => {
                      if (!coinType) return null;
                      return (
                        <Image
                          key={index}
                          src={`/images/${coinType}.png`}
                          alt={coinType}
                          width={25}
                          height={25}
                          className={`${styles.coin} draggable-elem`}
                          draggable={true}
                        />
                      );
                    })}
                    {cell === "+" && <span className={styles.plusSign}>+</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
    </div>
  );
};

export default TasuHissan;