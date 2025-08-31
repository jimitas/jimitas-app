import React, { useState, useEffect } from "react";
import * as se from "src/components/se";
import { BtnShowAnswer } from "src/components/PutButton/btnShowAnswer";
import { BtnCheck } from "src/components/PutButton/btnCheck";
import { BtnQuestion } from "src/components/PutButton/btnQuestion";

// KukuRenshuコンポーネントのメインインターフェース
interface KukuRenshuProps {
  // 必要に応じて追加のpropsを定義
}

// 九九の問題を表すインターフェース
interface KukuProblem {
  multiplicand: number;
  multiplier: number;
  answer: number;
}

// 内部コンポーネント: 問題表示
export function ProblemDisplay({
  problem,
  showAnswer
}: {
  problem: KukuProblem;
  showAnswer: boolean;
}) {
  return (
    <div className="text-center mb-4">
      <div className="text-4xl font-bold text-gray-900 bg-gray-50 px-6 py-4 rounded-lg">
        <span className="text-pink-500 underline decoration-pink-500 decoration-3 underline-offset-4">{problem.multiplicand}</span>
        {" × "}
        <span className="text-blue-600 underline decoration-blue-600 decoration-3 underline-offset-4">{problem.multiplier}</span>
        {" = "}
        <span className="text-gray-900 font-bold">
          {showAnswer ? problem.answer : "?"}
        </span>
      </div>
    </div>
  );
}

// 内部コンポーネント: 答え入力
export function AnswerInput({
  onAnswerSubmit,
  disabled
}: {
  onAnswerSubmit: (answer: number) => void;
  disabled: boolean;
}) {
  const [inputValue, setInputValue] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numValue = parseInt(inputValue);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      onAnswerSubmit(numValue);
      setInputValue("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="flex flex-col gap-3">
        <label htmlFor="answer-input" className="text-lg font-bold text-gray-900 text-center">
          こたえをいれてください：
        </label>
        <input
          id="answer-input"
          type="number"
          min="0"
          max="100"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={disabled}
          className="px-4 py-3 text-lg border-2 border-gray-300 rounded-lg text-center transition-all duration-300 bg-gray-50 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
          placeholder="答えを入力"
          aria-label="九九の答えを入力"
        />
        <BtnCheck
          handleEvent={() => handleSubmit(new Event('submit') as unknown as React.FormEvent)}
          btnText="こたえる"
        />
      </div>
    </form>
  );
}

// 内部コンポーネント: 結果表示
export function ResultDisplay({
  isCorrect,
  userAnswer,
  correctAnswer,
  onNext
}: {
  isCorrect: boolean;
  userAnswer: number;
  correctAnswer: number;
  onNext: () => void;
}) {
  return (
    <div className={`text-center p-4 rounded-lg mb-4 ${isCorrect
      ? 'bg-blue-50 border-2 border-blue-600'
      : 'bg-red-50 border-2 border-red-600'
      }`}>
      <div className="mb-4">
        {isCorrect ? (
          <span className="text-2xl font-bold text-blue-600">せいかいです！</span>
        ) : (
          <div className="text-xl font-bold text-red-600 mb-3">
            <span>まちがいです</span>
            <div className="flex flex-col gap-2 mt-3 text-base text-gray-700">
              <span>あなたの答え: {userAnswer}</span>
              <span>せいかい: {correctAnswer}</span>
            </div>
          </div>
        )}
      </div>
      <BtnQuestion
        handleEvent={onNext}
        btnText="つぎのもんだい"
      />
    </div>
  );
}

// 内部コンポーネント: 統計表示
export function StatsDisplay({
  correctCount,
  totalCount
}: {
  correctCount: number;
  totalCount: number;
}) {
  const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  return (
    <div className="bg-gray-50 rounded-lg p-5 mb-5 border-2 border-gray-200">
      <h3 className="text-gray-900 text-center text-lg font-bold mb-4">せいせき</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center bg-white rounded-lg p-3 shadow-sm border border-gray-200">
          <span className="block text-sm text-gray-600 mb-2 font-medium">せいかい</span>
          <span className="block text-2xl font-bold text-blue-600">{correctCount}</span>
        </div>
        <div className="text-center bg-white rounded-lg p-3 shadow-sm border border-gray-200">
          <span className="block text-sm text-gray-600 mb-2 font-medium">もんだいすう</span>
          <span className="block text-2xl font-bold text-gray-900">{totalCount}</span>
        </div>
        <div className="text-center bg-white rounded-lg p-3 shadow-sm border border-gray-200">
          <span className="block text-sm text-gray-600 mb-2 font-medium">せいかくりつ</span>
          <span className="block text-2xl font-bold text-pink-500">{accuracy}%</span>
        </div>
      </div>
    </div>
  );
}

// メインコンポーネント: KukuRenshu_2
export function KukuRenshu_2() {
  // ステート管理
  const [currentProblem, setCurrentProblem] = useState<KukuProblem | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);

  // 新しい問題を生成する関数
  const generateNewProblem = (): KukuProblem => {
    const multiplicand = Math.floor(Math.random() * 9) + 1;
    const multiplier = Math.floor(Math.random() * 9) + 1;
    return {
      multiplicand,
      multiplier,
      answer: multiplicand * multiplier,
    };
  };

  // コンポーネントマウント時に最初の問題を生成
  useEffect(() => {
    setCurrentProblem(generateNewProblem());
  }, []);

  // 答えを送信するハンドラー
  const handleAnswerSubmit = (answer: number) => {
    if (!currentProblem) return;

    setUserAnswer(answer);
    const correct = answer === currentProblem.answer;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setCorrectCount(prev => prev + 1);
      try {
        se.seikai1.play(); // 正解音
      } catch (error) {
        console.log("Sound playback failed:", error);
      }
    } else {
      try {
        se.alertSound.play(); // 不正解音
      } catch (error) {
        console.log("Sound playback failed:", error);
      }
    }

    setTotalCount(prev => prev + 1);
  };

  // 次の問題へ進むハンドラー
  const handleNext = () => {
    setCurrentProblem(generateNewProblem());
    setShowAnswer(false);
    setUserAnswer(null);
    setIsCorrect(null);
    setShowResult(false);

    try {
      se.set.play(); // 次の問題音
    } catch (error) {
      console.log("Sound playback failed:", error);
    }
  };

  // 答えを表示/非表示するハンドラー
  const handleToggleAnswer = () => {
    setShowAnswer(prev => !prev);
    try {
      se.piron.play(); // 答え表示切り替え音
    } catch (error) {
      console.log("Sound playback failed:", error);
    }
  };

  // リセットハンドラー
  const handleReset = () => {
    setCorrectCount(0);
    setTotalCount(0);
    setCurrentProblem(generateNewProblem());
    setShowAnswer(false);
    setUserAnswer(null);
    setIsCorrect(null);
    setShowResult(false);

    try {
      se.reset.play(); // リセット音
    } catch (error) {
      console.log("Sound playback failed:", error);
    }
  };

  if (!currentProblem) {
    return <div className="text-center text-gray-600">読み込み中...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* 統計表示 */}
      <StatsDisplay
        correctCount={correctCount}
        totalCount={totalCount}
      />

      {/* 問題表示 */}
      <section className="bg-gray-50 rounded-lg p-5 mb-5 border-2 border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">もんだい</h2>
        <ProblemDisplay
          problem={currentProblem}
          showAnswer={showAnswer}
        />

        {/* 答え表示切り替えボタン */}
        <BtnShowAnswer
          handleEvent={handleToggleAnswer}
          btnText={showAnswer ? "答えをかくす" : "答えをみる"}
        />
      </section>

      {/* 答え入力 */}
      {!showResult && (
        <section className="bg-gray-50 rounded-lg p-5 mb-5 border-2 border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">こたえ</h2>
          <AnswerInput
            onAnswerSubmit={handleAnswerSubmit}
            disabled={false}
          />
        </section>
      )}

      {/* 結果表示 */}
      {showResult && (
        <section className="bg-gray-50 rounded-lg p-5 mb-5 border-2 border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">けっか</h2>
          <ResultDisplay
            isCorrect={isCorrect!}
            userAnswer={userAnswer!}
            correctAnswer={currentProblem.answer}
            onNext={handleNext}
          />
        </section>
      )}

      {/* リセットボタン */}
      <div className="text-center">
        <button
          onClick={handleReset}
          className="px-5 py-2 text-sm font-bold text-white bg-gray-600 border-2 border-gray-700 rounded-lg transition-all duration-300 shadow-md hover:bg-gray-700 hover:shadow-lg hover:-translate-y-0.5"
          aria-label="統計をリセット"
        >
          せいせきをリセット
        </button>
      </div>
    </div>
  );
}