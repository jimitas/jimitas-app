import React, { useState, useEffect } from "react";
import styles from "./kukuArray.module.css";
import * as se from "src/components/se";

// KukuArrayコンポーネントのメインインターフェース
interface KukuArrayProps {
  // 必要に応じて追加のpropsを定義
}

// 内部コンポーネント用のインターフェース
interface KukuArrayControlsProps {
  type: "top" | "left";
  currentValue: number;
  onValueChange: (value: number) => void;
  label: string;
}

interface KukuArrayEquationProps {
  multiplicand: number;
  multiplier: number;
  showAnswer: boolean;
  onToggleAnswer: () => void;
}

interface KukuArrayGridProps {
  multiplicand: number;
  multiplier: number;
  hasInteracted: boolean;
}

// 内部コンポーネント: コントロールボタン
const KukuArrayControls: React.FC<KukuArrayControlsProps> = ({
  type,
  currentValue,
  onValueChange,
  label,
}) => {
  const containerClass = type === "top" ? styles.topControls : styles.leftControls;
  const buttonClass = type === "top" ? styles.topButton : styles.leftButton;

  const renderButtons = () => {
    const buttons = [];
    for (let value = 1; value <= 9; value++) {
      const isSelected = value === currentValue;
      buttons.push(
        <button
          key={value}
          type="button"
          className={`${styles.controlButton} ${buttonClass} ${
            isSelected ? styles.controlButtonSelected : ""
          }`}
          onClick={() => onValueChange(value)}
          aria-label={`${value}（${label}）`}
          aria-pressed={isSelected}
        >
          {value}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className={containerClass} aria-label={`${label}（${type === "top" ? "上段" : "左側"}のボタン）`}>
      {renderButtons()}
    </div>
  );
};

// 内部コンポーネント: 計算式表示
const KukuArrayEquation: React.FC<KukuArrayEquationProps> = ({
  multiplicand,
  multiplier,
  showAnswer,
  onToggleAnswer,
}) => {
  const result = multiplicand * multiplier;

  return (
    <section className={styles.equationSection} aria-labelledby="equation-title">
      <h2 id="equation-title" className="visually-hidden">計算式</h2>
      <div className={styles.equationRow}>
        <div className={styles.equationDisplay} aria-live="polite" aria-atomic="true">
          <span className={styles.firstNumber}>{multiplicand}</span>
          {" × "}
          <span className={styles.secondNumber}>{multiplier}</span>
          {" = "}
          <span className="result">
            {showAnswer ? result : "?"}
          </span>
        </div>
        <button
          type="button"
          className={`${styles.toggleButton} ${showAnswer ? styles.toggleButtonPressed : ""}`}
          onClick={onToggleAnswer}
          aria-label="答えの表示を切り替える"
          aria-pressed={showAnswer}
        >
          {showAnswer ? "答えをかくす" : "答えをみる　"}
        </button>
      </div>
    </section>
  );
};

// 内部コンポーネント: アレイ図グリッド
const KukuArrayGrid: React.FC<KukuArrayGridProps> = ({
  multiplicand,
  multiplier,
  hasInteracted,
}) => {
  const renderDots = () => {
    const dots = [];
    
    for (let rowIndex = 1; rowIndex <= 9; rowIndex++) {
      for (let colIndex = 1; colIndex <= 9; colIndex++) {
        // 点灯判定: 初回クリック前は点灯しない
        const isLit = hasInteracted &&
          rowIndex <= multiplicand &&
          colIndex <= multiplier;

        dots.push(
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`${styles.dot} ${isLit ? styles.dotLit : ""}`}
            data-row={rowIndex}
            data-col={colIndex}
          />
        );
      }
    }
    
    return dots;
  };

  return (
    <div
      className={styles.grid}
      role="grid"
      aria-label="九九のアレイ図"
      aria-rowcount={9}
      aria-colcount={9}
    >
      {renderDots()}
    </div>
  );
};

// メインコンポーネント: KukuArray
const KukuArray: React.FC<KukuArrayProps> = () => {
  // ステート管理
  const [multiplicand, setMultiplicand] = useState<number>(3); // 被乗数（縦の個数）
  const [multiplier, setMultiplier] = useState<number>(4); // 乗数（横の個数）
  const [showAnswer, setShowAnswer] = useState<boolean>(false); // 答えを表示するかどうか
  const [hasInteracted, setHasInteracted] = useState<boolean>(false); // 初回インタラクションがあったか

  // 値が変更されたときの処理
  useEffect(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    // 値が変わったら答えを非表示にする
    setShowAnswer(false);
  }, [multiplicand, multiplier, hasInteracted]);

  // 被乗数変更ハンドラー
  const handleMultiplicandChange = (value: number) => {
    setMultiplicand(value);
    try {
      se.pi.play(); // ボタンクリック音
    } catch (error) {
      console.log("Sound playback failed:", error);
    }
  };

  // 乗数変更ハンドラー
  const handleMultiplierChange = (value: number) => {
    setMultiplier(value);
    try {
      se.pi.play(); // ボタンクリック音
    } catch (error) {
      console.log("Sound playback failed:", error);
    }
  };

  // 答え表示切り替えハンドラー
  const handleToggleAnswer = () => {
    setShowAnswer(prev => !prev);
    try {
      se.piron.play(); // 答え表示切り替え音
    } catch (error) {
      console.log("Sound playback failed:", error);
    }
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  return (
    <div className={styles.arrayApp}>
      {/* 計算式表示（最上段） */}
      <KukuArrayEquation
        multiplicand={multiplicand}
        multiplier={multiplier}
        showAnswer={showAnswer}
        onToggleAnswer={handleToggleAnswer}
      />

      {/* アレイ図セクション */}
      <section className={styles.arraySection}>
        <h2 className="visually-hidden">アレイ図</h2>
        <div className={styles.layout}>
          <div className={styles.corner}>×</div>
          
          {/* 上部コントロール（青色ボタン列） */}
          <KukuArrayControls
            type="top"
            currentValue={multiplier}
            onValueChange={handleMultiplierChange}
            label="かける数"
          />
          
          {/* 左側コントロール（ピンク色ボタン行） */}
          <KukuArrayControls
            type="left"
            currentValue={multiplicand}
            onValueChange={handleMultiplicandChange}
            label="かけられる数"
          />
          
          {/* アレイ図グリッド */}
          <KukuArrayGrid
            multiplicand={multiplicand}
            multiplier={multiplier}
            hasInteracted={hasInteracted}
          />
        </div>
      </section>
    </div>
  );
};

export default KukuArray;