import React, { useState, useEffect, useRef } from "react";
import * as se from "src/components/se";
import { BtnQuestion } from "src/components/PutButton/btnQuestion";
import { BtnCheck } from "src/components/PutButton/btnCheck";
import { BtnShowAnswer } from "src/components/PutButton/btnShowAnswer";

// Tokeiコンポーネントのメインインターフェース
interface TokeiProps {
  // 必要に応じて追加のpropsを定義
}

// メインコンポーネント: Tokei
export function Tokei() {
  // ステート管理
  const [hours, setHours] = useState<number>(6);
  const [minutes, setMinutes] = useState<number>(0);
  const [scoreEasy, setScoreEasy] = useState<number>(0);
  const [scoreNormal, setScoreNormal] = useState<number>(0);
  const [scoreDifficult, setScoreDifficult] = useState<number>(0);
  const [flag, setFlag] = useState<boolean>(true);
  const [hariHours, setHariHours] = useState<number>(0);
  const [hariMinutes, setHariMinutes] = useState<number>(0);
  const [hint, setHint] = useState<string>("");
  const [type, setType] = useState<string>("nanji");
  const [mode, setMode] = useState<string>("easy");
  const [clockText, setClockText] = useState<string>("");
  const [rangeValue, setRangeValue] = useState<number>(360);
  const [inputHours, setInputHours] = useState<string>("");
  const [inputMinutes, setInputMinutes] = useState<string>("");

  // Canvas用のref
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // 初期化
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctxRef.current = ctx;
        draw();
      }
    }
  }, []);

  // 時計の描画関数
  const draw = () => {
    if (!ctxRef.current) return;
    const ctx = ctxRef.current;

    // 時計の盤面を描画
    ctx.clearRect(0, 0, 400, 400);
    ctx.beginPath();
    ctx.arc(200, 200, 150, 0, Math.PI * 2);
    ctx.lineWidth = 1.0;
    ctx.strokeStyle = "black";
    ctx.stroke();

    // 目盛りを描画
    for (let l = 0; l < 60; l++) {
      ctx.beginPath();
      ctx.moveTo(200 + 150 * Math.cos((Math.PI / 180) * (270 + l * 6)), 200 + 150 * Math.sin((Math.PI / 180) * (270 + l * 6)));
      ctx.lineTo(200 + 145 * Math.cos((Math.PI / 180) * (270 + l * 6)), 200 + 145 * Math.sin((Math.PI / 180) * (270 + l * 6)));
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = "black";
      ctx.stroke();
    }

    // 時間の目盛りを描画
    for (let m = 0; m < 12; m++) {
      ctx.beginPath();
      ctx.moveTo(200 + 150 * Math.cos((Math.PI / 180) * (270 + m * 30)), 200 + 150 * Math.sin((Math.PI / 180) * (270 + m * 30)));
      ctx.lineTo(200 + 140 * Math.cos((Math.PI / 180) * (270 + m * 30)), 200 + 140 * Math.sin((Math.PI / 180) * (270 + m * 30)));
      ctx.lineWidth = 2.0;
      ctx.strokeStyle = "black";
      ctx.stroke();
    }

    // 数字を描画
    ctx.font = "30px 'ＭＳ ゴシック'";
    ctx.textAlign = "center";
    const textArrX = [260, 305, 325, 310, 265, 200, 140, 95, 75, 95, 135, 200];
    const textArrY = [105, 150, 210, 275, 320, 335, 320, 270, 210, 150, 105, 85];
    for (let i = 0; i <= 11; i++) {
      ctx.fillText(String(i + 1), textArrX[i], textArrY[i]);
    }

    // ヒントを描画
    if (hint === "hint1") {
      ctx.font = "15px 'ＭＳ ゴシック'";
      const textArrX2 = [200, 280, 340, 360, 340, 280, 200, 120, 60, 40, 60, 120];
      const textArrY2 = [45, 65, 125, 205, 285, 345, 365, 345, 285, 205, 125, 65];
      for (let i = 0; i <= 11; i++) {
        ctx.fillText(String(i * 5), textArrX2[i], textArrY2[i]);
      }
    } else if (hint === "hint2") {
      ctx.font = "15px 'ＭＳ ゴシック'";
      for (let i = 0; i < 60; i++) {
        ctx.fillText(String(i), 200 + 160 * Math.cos((Math.PI / 180) * (270 + i * 6)), 205 + 160 * Math.sin((Math.PI / 180) * (270 + i * 6)));
      }
    }

    // 針を描画
    // 分針
    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.lineWidth = 3.0;
    ctx.lineTo(200 + 130 * Math.cos((Math.PI / 180) * (270 + 6 * minutes)), 200 + 130 * Math.sin((Math.PI / 180) * (270 + 6 * minutes)));
    ctx.strokeStyle = "blue";
    ctx.stroke();

    // 時針
    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.lineWidth = 6.0;
    ctx.lineTo(200 + 100 * Math.cos((Math.PI / 180) * (270 + 30 * (hours + minutes / 60))), 200 + 100 * Math.sin((Math.PI / 180) * (270 + 30 * (hours + minutes / 60))));
    ctx.strokeStyle = "red";
    ctx.stroke();
  };

  // スライダーの値が変更されたとき
  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setRangeValue(value);
    const newHours = Math.floor(value / 60);
    const newMinutes = Math.floor(value % 60);
    setHours(newHours);
    setMinutes(newMinutes);

    try {
      se.kako.play();
    } catch (error) {
      console.log("Sound playback failed:", error);
    }

    draw();
  };

  // プラスボタン
  const handlePlus = () => {
    const step = mode === "easy" ? 15 : mode === "normal" ? 5 : 1;
    const newValue = Math.floor(rangeValue + step);
    setRangeValue(newValue);
    const newHours = Math.floor(newValue / 60);
    const newMinutes = Math.floor(newValue % 60);
    setHours(newHours);
    setMinutes(newMinutes);

    try {
      se.kako.play();
    } catch (error) {
      console.log("Sound playback failed:", error);
    }

    draw();
  };

  // マイナスボタン
  const handleMinus = () => {
    const step = mode === "easy" ? 15 : mode === "normal" ? 5 : 1;
    const newValue = Math.floor(rangeValue - step);
    setRangeValue(newValue);
    const newHours = Math.floor(newValue / 60);
    const newMinutes = Math.floor(newValue % 60);
    setHours(newHours);
    setMinutes(newMinutes);

    try {
      se.kako.play();
    } catch (error) {
      console.log("Sound playback failed:", error);
    }

    draw();
  };

  // 問題ボタン
  const handleQuestion = () => {
    setInputHours("");
    setInputMinutes("");
    setClockText("なんじ　なんふん？");
    setFlag(true);

    try {
      se.set.play();
    } catch (error) {
      console.log("Sound playback failed:", error);
    }

    let newHours = Math.floor(Math.random() * 12 + 1);
    let newMinutes = 0;

    switch (mode) {
      case "easy":
        newMinutes = Math.floor(Math.random() * 4) * 15;
        break;
      case "normal":
        newMinutes = Math.floor(Math.random() * 12) * 5;
        break;
      case "difficult":
        newMinutes = Math.floor(Math.random() * 60);
        break;
    }

    if (type === "nanji") {
      setClockText("なんじ　なんふん？");
      setHours(newHours);
      setMinutes(newMinutes);
      draw();
    } else if (type === "ugokasu") {
      setHariHours(newHours);
      setHariMinutes(newMinutes);
      setClockText(`${newHours}じ　${newMinutes}ふんに　はりを　うごかそう`);
      setHours(6);
      setMinutes(0);
      setRangeValue(360);
      draw();
    }
  };

  // 答え合わせボタン
  const handleCheck = () => {
    if (!flag) return;

    let currentHours = hours === 0 ? 12 : hours;
    let currentMinutes = minutes;

    if (type === "nanji") {
      const answerHours = parseInt(inputHours) || 0;
      const answerMinutes = parseInt(inputMinutes) || 0;

      if (currentHours === answerHours && currentMinutes === answerMinutes) {
        try {
          se.seikai1.play();
        } catch (error) {
          console.log("Sound playback failed:", error);
        }

        setClockText("せいかい！");
        setFlag(false);

        switch (mode) {
          case "easy":
            setScoreEasy(prev => prev + 1);
            break;
          case "normal":
            setScoreNormal(prev => prev + 1);
            break;
          case "difficult":
            setScoreDifficult(prev => prev + 1);
            break;
        }
      } else {
        try {
          se.alertSound.play();
        } catch (error) {
          console.log("Sound playback failed:", error);
        }
      }
    } else if (type === "ugokasu") {
      const answerHours = Math.floor(rangeValue / 60);
      const answerMinutes = Math.floor(rangeValue % 60);

      if (hariHours === answerHours && hariMinutes === answerMinutes) {
        try {
          se.seikai1.play();
        } catch (error) {
          console.log("Sound playback failed:", error);
        }

        setClockText("せいかい！");
        setFlag(false);

        switch (mode) {
          case "easy":
            setScoreEasy(prev => prev + 1);
            break;
          case "normal":
            setScoreNormal(prev => prev + 1);
            break;
          case "difficult":
            setScoreDifficult(prev => prev + 1);
            break;
        }
      } else {
        try {
          se.alertSound.play();
        } catch (error) {
          console.log("Sound playback failed:", error);
        }
      }
    }
  };

  // 答えを見るボタン
  const handleAnswer = () => {
    try {
      se.seikai2.play();
    } catch (error) {
      console.log("Sound playback failed:", error);
    }

    if (type === "nanji") {
      const currentHours = hours === 0 ? 12 : hours;
      setClockText(`こたえは　${currentHours}じ　${minutes}ふん　です。`);
    } else if (type === "ugokasu") {
      setHours(hariHours);
      setMinutes(hariMinutes);
      draw();
    }
  };

  // ヒント1ボタン
  const handleHint1 = () => {
    try {
      se.set.play();
    } catch (error) {
      console.log("Sound playback failed:", error);
    }

    setHint(hint === "hint1" ? "" : "hint1");
    draw();
  };

  // ヒント2ボタン
  const handleHint2 = () => {
    try {
      se.set.play();
    } catch (error) {
      console.log("Sound playback failed:", error);
    }

    setHint(hint === "hint2" ? "" : "hint2");
    draw();
  };

  // モード変更時の処理
  useEffect(() => {
    draw();
  }, [hours, minutes, hint]);

  return (
    <div className="max-w-4xl bg-slate-100 mx-auto p-6">
      {/* 時計テキスト */}
      <h3 className="text-2xl font-bold text-gray-900 bg-yellow-100 p-2 mb-4" style={{ width: '720px', height: '40px' }}>
        {clockText}
      </h3>

      <h6 className="text-lg text-gray-700 mb-4">とけいのはりは，このスライダーでうごかせます。</h6>

      {/* スライダー */}
      <input
        id="tokei_range"
        type="range"
        className="w-full h-12 cursor-pointer mb-4"
        min={0}
        max={720}
        step={mode === "easy" ? 15 : mode === "normal" ? 5 : 1}
        value={rangeValue}
        onChange={handleRangeChange}
      />

      {/* +/- ボタン */}
      <div className="flex justify-between w-full mb-6">
        <button
          id="Minus"
          onClick={handleMinus}
          className="px-6 py-2 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors duration-200"
        >
          -
        </button>
        <button
          id="Plus"
          onClick={handlePlus}
          className="px-6 py-2 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors duration-200"
        >
          +
        </button>
      </div>

      {/* メインコンテンツ */}
      <div className="flex flex-wrap gap-6 ">
        {/* 時計キャンバス */}
        <div className="bg-white">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            id="clock"
            className="border-2 border-gray-300 rounded-lg"
          />
        </div>

        {/* 右側のコントロール */}
        <div className="flex-1">
          {/* セレクトボックス */}
          <select
            name="type"
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-48 h-10 px-3 border-2 border-gray-300 rounded-lg mb-4 mr-4"
          >
            <option value="nanji">なんじなんふん？</option>
            <option value="ugokasu">はりをうごかそう</option>
          </select>

          <select
            name="mode"
            id="mode"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-36 h-10 px-3 border-2 border-gray-300 rounded-lg mb-4"
          >
            <option value="easy">やさしい</option>
            <option value="normal">ふつう</option>
            <option value="difficult">むずかしい</option>
          </select>

          {/* スコア表示 */}
          <h4 className="text-left font-sans mb-4">
            かんたん　…{scoreEasy}もん　せいかい<br />
            ふつう　　…{scoreNormal}もん　せいかい<br />
            むずかしい…{scoreDifficult}もん　せいかい
          </h4>

          {/* ボタン群 */}
          <div className="space-y-3 mb-2">
            {/* 1行目: もんだい、こたえあわせ、こたえをみる */}
            <div className="flex flex-wrap gap-2">
              <BtnQuestion
                handleEvent={handleQuestion}
                btnText="もんだい"
              />
              <BtnCheck
                handleEvent={handleCheck}
                btnText="こたえあわせ"
              />
              <BtnShowAnswer
                handleEvent={handleAnswer}
                btnText="こたえをみる"
              />
            </div>

            {/* 2行目: ヒント１、ヒント２ */}
            <div className="flex flex-wrap gap-2 ml-2">
              <button
                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors duration-200"
                id="hint1"
                onClick={handleHint1}
              >
                ヒント１
              </button>
              <button
                className="px-6 py-2 bg-yellow-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors duration-200"
                id="hint2"
                onClick={handleHint2}
              >
                ヒント２
              </button>
            </div>
          </div>

          {/* 入力フィールド */}
          <div className="mt-6">
            <input
              id="input_hours"
              className="input-box w-20 h-10 px-3 border-2 border-gray-300 rounded-lg mr-2"
              type="number"
              max={12}
              min={1}
              value={inputHours}
              onChange={(e) => setInputHours(e.target.value)}
            />
            じ
            <input
              id="input_minutes"
              className="input-box w-20 h-10 px-3 border-2 border-gray-300 rounded-lg ml-4 mr-2"
              type="number"
              max={59}
              min={0}
              value={inputMinutes}
              onChange={(e) => setInputMinutes(e.target.value)}
            />
            ふん
          </div>
        </div>
      </div>
    </div>
  );
}