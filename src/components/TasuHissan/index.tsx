import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import * as se from "src/components/se";
import { useDragDrop } from "src/hooks/useDragDrop";
import styles from "./tasuHissan.module.css";

const TasuHissan: React.FC = () => {
  // 状態管理
  const [selectIndex, setSelectIndex] = useState<number>(0);
  const [leftNumber, setLeftNumber] = useState<number>(0);
  const [rightNumber, setRightNumber] = useState<number>(0);
  const [answer, setAnswer] = useState<number>(0);
  const [leftNumberArray, setLeftNumberArray] = useState<number[]>([]);
  const [rightNumberArray, setRightNumberArray] = useState<number[]>([]);
  const [answerArray, setAnswerArray] = useState<number[]>([]);
  const [myAnswer, setMyAnswer] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [mondaiFlag, setMondaiFlag] = useState<boolean>(false);

  // テーブルデータ
  const [tableData, setTableData] = useState<string[][]>(Array(4).fill(null).map(() => Array(4).fill("")));
  const [moneyTableData, setMoneyTableData] = useState<string[][]>(Array(4).fill(null).map(() => Array(4).fill("")));

  // リファレンス
  const tableRef = useRef<HTMLTableElement>(null);
  const moneyTableRef = useRef<HTMLTableElement>(null);

  // ドラッグ&ドロップ
  const { dragStart, dragOver, dropEnd, touchStart, touchMove, touchEnd } = useDragDrop();

  // セレクトボックスのオプション
  const selectOptions = [
    "(２けた)+(２けた)",
    "(３けた)+(２けた)",
    "(２けた)+(３けた)",
    "(３けた)+(３けた)"
  ];

  // 筆算テーブル書き換え
  const rewriteTable = useCallback(() => {
    const newTableData = Array(4).fill(null).map(() => Array(4).fill(""));

    // 左の数を配置
    for (let col = 0; col < leftNumberArray.length; col++) {
      newTableData[1][4 - leftNumberArray.length + col] = leftNumberArray[col].toString();
    }

    // 右の数を配置
    for (let col = 0; col < rightNumberArray.length; col++) {
      newTableData[2][4 - rightNumberArray.length + col] = rightNumberArray[col].toString();
    }

    // +の位置の挿入
    if (leftNumber < 100 && rightNumber < 100) {
      newTableData[2][1] = "+";
    } else {
      newTableData[2][0] = "+";
    }

    setTableData(newTableData);
  }, [leftNumberArray, rightNumberArray, leftNumber, rightNumber]);

  // お金テーブル書き換え（3桁対応）
  const rewriteMoneyTable = useCallback(() => {
    const newMoneyTableData = Array(4).fill(null).map(() => Array(4).fill(""));

    // 3桁対応の画像配列
    const img_arr = ["senen", "hyakuen", "juuen", "ichien"];
    // const img_arr = ["ichien", "juuen", "hyakuen", "senen"];

    // 左の数のお金を配置
    for (let col = 0; col < leftNumberArray.length; col++) {
      for (let i = 0; i < leftNumberArray[col]; i++) {
        const coinType = img_arr[4 - leftNumberArray.length + col];
        newMoneyTableData[1][4 - leftNumberArray.length + col] += coinType + ",";
      }
    }

    // 右の数のお金を配置
    for (let col = 0; col < rightNumberArray.length; col++) {
      for (let i = 0; i < rightNumberArray[col]; i++) {
        const coinType = img_arr[4 - rightNumberArray.length + col];
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

  // くり上がり処理（お金の移動時）
  const handleMoneyCarry = useCallback(() => {
    const img_arr = ["ichien", "juuen", "hyakuen", "senen"];

    // 各桁で10個以上のコインがあるかチェック
    for (let j = 0; j < 3; j++) {
      const cell = moneyTableRef.current?.rows[3]?.cells[3 - j];
      if (cell) {
        const coins = cell.getElementsByClassName(img_arr[j]);
        if (coins.length > 9) {
          // 10個のコインを削除
          for (let i = 0; i < 10; i++) {
            if (coins[0]) {
              coins[0].remove();
            }
          }
          // 上位の桁に1個追加
          const newCoin = document.createElement("img");
          newCoin.src = `/images/${img_arr[j + 1]}.png`;
          newCoin.className = img_arr[j + 1];
          newCoin.style.width = j === 2 ? "60px" : "25px";
          newCoin.style.height = "25px";
          newCoin.draggable = true;
          newCoin.addEventListener("touchstart", touchStart, false);
          newCoin.addEventListener("touchmove", touchMove, false);
          newCoin.addEventListener("touchend", touchEnd, false);

          const targetCell = moneyTableRef.current?.rows[0]?.cells[2 - j];
          if (targetCell) {
            targetCell.appendChild(newCoin);
          }
        }
      }
    }
  }, [touchStart, touchMove, touchEnd]);

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

  // 数字パレットの再生成
  const regenerateNumberPalette = useCallback(() => {
    const numPalletElement = document.getElementById("num-pallet");
    if (numPalletElement) {
      while (numPalletElement.firstChild) {
        numPalletElement.removeChild(numPalletElement.firstChild);
      }
      numberSet();
    }
  }, [numberSet]);

  // 答えの計算
  const calculateAnswer = useCallback(() => {
    if (!tableRef.current) return;

    let calculatedAnswer = 0;
    for (let col = 0; col < 4; col++) {
      const cellValue = tableRef.current.rows[3].cells[col].innerText;
      if (cellValue) {
        calculatedAnswer += Number(cellValue) * Math.pow(10, 3 - col);
      }
    }
    setMyAnswer(calculatedAnswer);

    if (calculatedAnswer === answer) {
      se.seikai1.play();
    }
  }, [answer]);

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
    const leftArray = String(newLeftNumber).split("").map(Number);
    const rightArray = String(newRightNumber).split("").map(Number);
    const answerArray = String(newAnswer).split("").map(Number);

    setLeftNumberArray(leftArray);
    setRightNumberArray(rightArray);
    setAnswerArray(answerArray);

    rewriteTable();
    rewriteMoneyTable();
  };

  // 消すボタン
  const handleClear = () => {
    const clearedTableData = Array(4).fill(null).map(() => Array(4).fill(""));
    setTableData(clearedTableData);
    setMoneyTableData(clearedTableData);
    setMondaiFlag(false);
    setLeftNumber(0);
    setRightNumber(0);
    setLeftNumberArray([]);
    setRightNumberArray([]);
    setAnswerArray([]);
    setMyAnswer(0);
    se.reset.play();
  };

  // 答えを見る
  const showAnswer = () => {
    if (!mondaiFlag) return;

    se.seikai2.play();

    // くり上がりの表示
    let carry = 0;
    for (let col = 0; col < Math.min(leftNumberArray.length, rightNumberArray.length); col++) {
      const sum = leftNumberArray[col] + rightNumberArray[col] + carry;
      if (sum > 9) {
        // くり上がりを表示
        const carryCell = tableRef.current?.rows[0]?.cells[4 - col - 2];
        if (carryCell) {
          carryCell.innerHTML = "1";
          carryCell.style.fontSize = "20px";
          carryCell.style.color = "red";
          carryCell.style.verticalAlign = "bottom";
        }
        carry = 1;
      } else {
        carry = 0;
      }
    }

    // 答えを表示
    for (let col = 0; col < answerArray.length; col++) {
      const answerCell = tableRef.current?.rows[3]?.cells[4 - answerArray.length + col];
      if (answerCell) {
        answerCell.innerHTML = answerArray[col].toString();
      }
    }
  };

  // 答え合わせ
  const checkAnswer = () => {
    calculateAnswer();
  };

  // カスタムドロップ処理
  const handleCustomDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const dragged = e.dataTransfer?.getData("text/html");

    if (!dragged) return;

    if (target.className.includes("droppable-elem")) {
      // 数字のドロップ
      regenerateNumberPalette();
      calculateAnswer();
      se.pi.play();
    } else if (target.className.includes("droppable-elem-2")) {
      // お金のドロップ
      handleMoneyCarry();
      se.pi.play();
    }
  }, [regenerateNumberPalette, calculateAnswer, handleMoneyCarry]);

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

    // カスタムドロップイベントを追加
    document.addEventListener("drop", handleCustomDrop as EventListener, false);

    return () => {
      document.removeEventListener("drop", handleCustomDrop as EventListener, false);
    };
  }, [selectIndex, handleCustomDrop, numberSet]);

  return (
    <div className={styles.container}>
      {/* 問題選択セクション */}
      <div className={styles.questionSection}>
        <label className={styles.questionLabel}>問題の種類を選んでください：</label>
        <select
          className={styles.selectBox}
          value={selectIndex}
          onChange={(e) => handleSelectChange(Number(e.target.value))}
        >
          {selectOptions.map((option, index) => (
            <option key={index} value={index}>
              {option}
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

      {/* 筆算テーブルとお金テーブルを横並びに */}
      <div className="flex justify-center items-start gap-5 my-5 flex-wrap">
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
                      <div className="flex flex-wrap justify-start">
                        {cell && cell !== "+" && cell.split(",").map((coinType, index) => {
                          if (!coinType) return null;
                          return (
                            <Image
                              key={index}
                              src={`/images/${coinType}.png`}
                              alt={coinType}
                              width={25}
                              height={25}
                              className={`${styles.coin} draggable-elem w-[25px] h-[25px]`}
                              draggable={true}
                            />
                          );
                        })}
                        {cell === "+" && <span className={styles.plusSign}>+</span>}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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