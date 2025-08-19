import { useMemo, useState } from "react";

interface ScoreBreakdown {
  hundreds: number;
  tens: number;
  ones: number;
}

interface ScoreCounterResult {
  breakdown: ScoreBreakdown;
  coinArray: number[];
  totalCoins: number;
  isShow: boolean;
  toggleDisplay: () => void;
}

export const useScoreCounter = (score: number): ScoreCounterResult => {
  const [isShow, setIsShow] = useState(true);

  // スコアを桁ごとに分解（123 → 百の位:1, 十の位:2, 一の位:3）
  const breakdown = useMemo((): ScoreBreakdown => {
    const hundreds = Math.floor(score / 100);
    const tens = Math.floor((score % 100) / 10);
    const ones = score % 10;
    return { hundreds, tens, ones };
  }, [score]);

  // コイン配列を生成（123点 → [100, 10, 10, 1, 1, 1]）
  const coinArray = useMemo((): number[] => {
    const coins: number[] = [];
    
    // 100コインを必要枚数分追加
    for (let i = 0; i < breakdown.hundreds; i++) {
      coins.push(100);
    }
    
    // 10コインを必要枚数分追加
    for (let i = 0; i < breakdown.tens; i++) {
      coins.push(10);
    }
    
    // 1コインを必要枚数分追加
    for (let i = 0; i < breakdown.ones; i++) {
      coins.push(1);
    }
    
    return coins;
  }, [breakdown]);

  // 総コイン枚数
  const totalCoins = coinArray.length;

  // 表示切り替え
  const toggleDisplay = () => {
    setIsShow((prevIsShow) => !prevIsShow);
  };

  return { 
    breakdown, 
    coinArray, 
    totalCoins, 
    isShow, 
    toggleDisplay 
  };
};
