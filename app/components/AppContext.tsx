"use client";
import {
  useState,
  createContext,
  ReactNode,
  useContext,
  useRef,
  useEffect,
} from "react";

type Funcs = {
  pause: () => void;
  resume: () => void;
  setAlive: (row: number, col: number) => void;
  clearGrid: () => void;
  setGridPattern: (patternId: number) => void;
  setGrid: (newGrid: number[][]) => void;
  generation: number;
};

const GameContext = createContext<(Funcs & { grid: number[][] }) | null>(null);

export function AppContext({ children }: { children: ReactNode }) {
  const Rows = 30;
  const Cols = 50;

  const [grid, setGrid] = useState<number[][]>(
    Array.from({ length: Rows }, () => Array(Cols).fill(0))
  );
  const [generation, setGeneration] = useState<number>(1);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearGrid = () => {
    setGrid(Array.from({ length: Rows }, () => Array(Cols).fill(0)));
    setGeneration(1);
    pause();
  };

  const setGridPattern = (patternId: number) => {
    clearGrid();
    const newGrid = Array.from({ length: Rows }, () => Array(Cols).fill(0));

    if (patternId === 1) {
      const gliderGun = [
        [5, 1],
        [5, 2],
        [6, 1],
        [6, 2],
        [5, 11],
        [6, 11],
        [7, 11],
        [4, 12],
        [8, 12],
        [3, 13],
        [9, 13],
        [3, 14],
        [9, 14],
        [6, 15],
        [4, 16],
        [8, 16],
        [5, 17],
        [6, 17],
        [7, 17],
        [6, 18],
        [3, 21],
        [4, 21],
        [5, 21],
        [3, 22],
        [4, 22],
        [5, 22],
        [2, 23],
        [6, 23],
        [1, 25],
        [2, 25],
        [6, 25],
        [7, 25],
        [3, 35],
        [4, 35],
        [3, 36],
        [4, 36],
      ];

      gliderGun.forEach(([r, c]) => {
        if (r >= 0 && r < Rows && c >= 0 && c < Cols) {
          newGrid[r][c] = 1;
        }
      });
    } else if (patternId === 2) {
      const pulsarPattern = [
        [2, 4],
        [2, 5],
        [2, 6],
        [2, 10],
        [2, 11],
        [2, 12],
        [4, 2],
        [5, 2],
        [6, 2],
        [4, 7],
        [5, 7],
        [6, 7],
        [4, 9],
        [5, 9],
        [6, 9],
        [4, 14],
        [5, 14],
        [6, 14],
        [7, 4],
        [7, 5],
        [7, 6],
        [7, 10],
        [7, 11],
        [7, 12],
        [9, 4],
        [9, 5],
        [9, 6],
        [9, 10],
        [9, 11],
        [9, 12],
        [10, 2],
        [11, 2],
        [12, 2],
        [10, 7],
        [11, 7],
        [12, 7],
        [10, 9],
        [11, 9],
        [12, 9],
        [10, 14],
        [11, 14],
        [12, 14],
        [14, 4],
        [14, 5],
        [14, 6],
        [14, 10],
        [14, 11],
        [14, 12],
      ];

      pulsarPattern.forEach(([r, c]) => {
        if (r >= 0 && r < Rows && c >= 0 && c < Cols) {
          newGrid[r][c] = 1;
        }
      });
    } else if (patternId === 3) {
      const glider = [
        [1, 2],
        [2, 3],
        [3, 1],
        [3, 2],
        [3, 3],
      ];

      glider.forEach(([r, c]) => {
        if (r >= 0 && r < Rows && c >= 0 && c < Cols) {
          newGrid[r][c] = 1;
        }
      });
    } else if (patternId === 4) {
      const largeSpaceship = [
        [0, 1],
        [0, 4],
        [1, 0],
        [2, 0],
        [2, 4],
        [3, 0],
        [3, 1],
        [3, 2],
        [3, 3],
      ];
      const offsetRow = 5;
      const offsetCol = 5;

      largeSpaceship.forEach(([r, c]) => {
        if (
          r + offsetRow >= 0 &&
          r + offsetRow < Rows &&
          c + offsetCol >= 0 &&
          c + offsetCol < Cols
        ) {
          newGrid[r + offsetRow][c + offsetCol] = 1;
        }
      });
    }

    setGrid(newGrid);
  };

  const nextGeneration = () => {
    setGrid((prevGrid) => {
      const newGrid = Array.from({ length: Rows }, () => Array(Cols).fill(0));

      for (let r = 0; r < Rows; r++) {
        for (let c = 0; c < Cols; c++) {
          let liveNeighbors = 0;

          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue;

              const nr = r + dr;
              const nc = c + dc;

              if (nr >= 0 && nr < Rows && nc >= 0 && nc < Cols) {
                liveNeighbors += prevGrid[nr][nc];
              }
            }
          }

          if (prevGrid[r][c] === 1) {
            newGrid[r][c] = liveNeighbors === 2 || liveNeighbors === 3 ? 1 : 0;
          } else {
            newGrid[r][c] = liveNeighbors === 3 ? 1 : 0;
          }
        }
      }
      return newGrid;
    });
    setGeneration((prev) => prev + 1);
  };

  const resume = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(nextGeneration, 150);
    }
  };

  const pause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const setAlive = (row: number, col: number) => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((rowArr) => [...rowArr]);
      newGrid[row][col] = newGrid[row][col] === 0 ? 1 : 0;
      return newGrid;
    });
  };
  //here...
  useEffect(() => {
    const initialGrid = Array.from({ length: Rows }, () =>
      Array.from({ length: Cols }, () => (Math.random() > 0.6 ? 1 : 0))
    );
    setGrid(initialGrid);
    resume();
  },);

  return (
    <GameContext.Provider
      value={{
        pause,
        resume,
        clearGrid,
        setAlive,
        setGridPattern,
        grid,
        setGrid,
        generation,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within an AppContext");
  }
  return context;
}
