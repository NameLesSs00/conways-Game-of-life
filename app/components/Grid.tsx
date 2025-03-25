"use client";
import { useGameContext } from "@/app/components/AppContext";
import { useEffect, useState } from "react";

function Grid() {
  const { grid, setAlive } = useGameContext();

  const ROWS = 30;
  const COLS = 50;
  const CELL_SIZE = 15;
  const GAP_SIZE = 1;
  const BORDER_WIDTH = 2;

  const gridWidth = COLS * (CELL_SIZE + GAP_SIZE) - GAP_SIZE + 2 * BORDER_WIDTH;
  const gridHeight =
    ROWS * (CELL_SIZE + GAP_SIZE) - GAP_SIZE + 2 * BORDER_WIDTH;

  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const availableWidth = window.innerWidth * 0.95;
      const availableHeight = window.innerHeight * 0.7;

      const widthScale = availableWidth / gridWidth;
      const heightScale = availableHeight / gridHeight;
      const newScale = Math.min(widthScale, heightScale, 1);

      setScale(Math.max(newScale, 0.5));
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [gridWidth, gridHeight]);

  const handleCellClick = (row: number, col: number) => {
    setAlive(row, col);
  };

  const scaledWidth = gridWidth * scale;
  const scaledHeight = gridHeight * scale;

  return (
    <div className="flex justify-center items-center w-full h-full overflow-hidden p-4">
      <div
        className="relative origin-center"
        style={{
          transform: `scale(${scale})`,
          width: `${gridWidth}px`,
          height: `${gridHeight}px`,
          transformOrigin: "center center",
        }}
      >
        <div
          className="border-[hsl(0deg,0%,14.9%)] border-2 grid bg-[hsl(0deg,0%,14.9%)] absolute top-0 left-0"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${COLS}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${ROWS}, ${CELL_SIZE}px)`,
            gap: `${GAP_SIZE}px`,
            width: `${gridWidth}px`,
            height: `${gridHeight}px`,
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`${
                  cell ? "bg-[#66ff33]" : "bg-black"
                } cursor-pointer`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Grid;
