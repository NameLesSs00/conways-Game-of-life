"use client";
import React, { useState } from "react";
import { Orbitron } from "next/font/google";
import { useGameContext } from "@/app/components/AppContext";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: "400",
});

function Menu() {
  const { resume, pause, clearGrid, setGridPattern, generation, setGrid } =
    useGameContext();

  const [isRunning, setIsRunning] = useState(true);
  const [showPatterns, setShowPatterns] = useState(false);

  const handleStartPauseResume = () => {
    if (isRunning) {
      pause();
    } else {
      resume();
    }
    setIsRunning(!isRunning);
  };

  const handleRandomize = () => {
    const ROWS = 30;
    const COLS = 50;
    const newGrid = Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => (Math.random() > 0.7 ? 1 : 0))
    );
    setGrid(newGrid);
    if (isRunning) {
      pause();
      setIsRunning(false);
    }
  };

  const handleClearBoard = () => {
    clearGrid();
    setIsRunning(false);
  };

  const handlePatternSelect = (patternId: number) => {
    setGridPattern(patternId);
    setShowPatterns(false);
    if (isRunning) {
      pause();
      setIsRunning(false);
    }
  };

  return (
    <div
      className={`${orbitron.className} bg-[#262626] flex flex-col justify-center items-center p-4 gap-2 w-full max-w-[500px] mx-auto rounded-lg shadow-lg`}
    >
      <div className="w-full bg-[#66ff33] p-2 rounded text-center">
        <p className="text-sm">Generation</p>
        <p className="font-bold">{generation.toString()}</p>
      </div>

      <div className="w-full grid grid-cols-2 gap-2">
        <button
          className="bg-[#66ff33] hover:bg-[#55ee22] p-2 rounded transition-colors"
          onClick={handleStartPauseResume}
        >
          {isRunning ? "⏸ Pause" : "▶ Start"}
        </button>

        <button
          className="bg-[#66ff33] hover:bg-[#55ee22] p-2 rounded transition-colors"
          onClick={handleRandomize}
        >
          🎲 Randomize
        </button>

        <button
          className="bg-[#66ff33] hover:bg-[#55ee22] p-2 rounded transition-colors"
          onClick={handleClearBoard}
        >
          🧹 Clear
        </button>

        <button
          className="bg-[#66ff33] hover:bg-[#55ee22] p-2 rounded transition-colors"
          onClick={() => setShowPatterns(!showPatterns)}
        >
          {showPatterns ? "▲ Hide" : "▼ Patterns"}
        </button>
      </div>

      {showPatterns && (
        <div className="w-full grid grid-cols-2 gap-2 mt-2">
          <button
            className="bg-[#448833] hover:bg-[#55ee22] p-2 rounded text-sm"
            onClick={() => handlePatternSelect(1)}
          >
            Glider Gun
          </button>
          <button
            className="bg-[#448833] hover:bg-[#55ee22] p-2 rounded text-sm"
            onClick={() => handlePatternSelect(2)}
          >
            Pulsar
          </button>
          <button
            className="bg-[#448833] hover:bg-[#55ee22] p-2 rounded text-sm"
            onClick={() => handlePatternSelect(3)}
          >
            Glider
          </button>
          <button
            className="bg-[#448833] hover:bg-[#55ee22] p-2 rounded text-sm"
            onClick={() => handlePatternSelect(4)}
          >
            Spaceship
          </button>
        </div>
      )}
    </div>
  );
}

export default Menu;
