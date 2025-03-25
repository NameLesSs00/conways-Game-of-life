"use client";
import {
  useState,
  createContext,
  ReactNode,
  useContext,
  useRef,
  useEffect,
  useCallback,
} from "react";

type Funcs = {
  pause: () => void;
  resume: () => void;
  setAlive: (row: number, col: number) => void;
  clearGrid: () => void;
  setGridPattern: (patternId: number) => void;
  generation: number;
  grid: number[][];
  setGrid: (grid: number[][]) => void;
};

const GameContext = createContext<Funcs | null>(null);

export function AppContext({ children }: { children: ReactNode }) {
  const Rows = 30;
  const Cols = 50;
  const [grid, setGrid] = useState<number[][]>(
    Array.from({ length: Rows }, () => Array(Cols).fill(0))
  );
  const [generation, setGeneration] = useState<number>(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextGeneration = useCallback(() => {
    setGrid((prevGrid) => {
      const newGrid = Array.from({ length: Rows }, () => Array(Cols).fill(0));

      for (let r = 0; r < Rows; r++) {
        for (let c = 0; c < Cols; c++) {
          let liveNeighbors = 0;

          const minRow = Math.max(0, r - 1);
          const maxRow = Math.min(Rows - 1, r + 1);
          const minCol = Math.max(0, c - 1);
          const maxCol = Math.min(Cols - 1, c + 1);

          for (let nr = minRow; nr <= maxRow; nr++) {
            for (let nc = minCol; nc <= maxCol; nc++) {
              if (nr === r && nc === c) continue;
              liveNeighbors += prevGrid[nr][nc];
            }
          }

          newGrid[r][c] = prevGrid[r][c]
            ? liveNeighbors === 2 || liveNeighbors === 3
              ? 1
              : 0
            : liveNeighbors === 3
            ? 1
            : 0;
        }
      }
      return newGrid;
    });
    setGeneration((prev) => prev + 1);
  }, [Rows, Cols]);

  const resume = useCallback(() => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(nextGeneration, 100); 
    }
  }, [nextGeneration]);

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const clearGrid = useCallback(() => {
    setGrid(Array.from({ length: Rows }, () => Array(Cols).fill(0)));
    setGeneration(1);
    pause();
  }, [Rows, Cols, pause]);

  const setAlive = useCallback((row: number, col: number) => {
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      newGrid[row] = [...prevGrid[row]];
      newGrid[row][col] = prevGrid[row][col] === 0 ? 1 : 0;
      return newGrid;
    });
  }, []);

  const centerPattern = (pattern: number[][]) => {
    const centerRow = Math.floor(Rows / 2);
    const centerCol = Math.floor(Cols / 2);
    return pattern.map(([r, c]) => [centerRow + r, centerCol + c]);
  };


  const PATTERNS = {
    GLIDER_GUN: [
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
    ],
    PULSAR: [
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
    ],
    GLIDER: [
      [1, 2],
      [2, 3],
      [3, 1],
      [3, 2],
      [3, 3],
    ],
    SPACESHIP: [
      [0, 1],
      [0, 4],
      [1, 0],
      [2, 0],
      [2, 4],
      [3, 0],
      [3, 1],
      [3, 2],
      [3, 3],
    ],
  };

  const SPACESHIP_OFFSET = { row: 5, col: 5 };

  const setGridPattern = useCallback(
    (patternId: number) => {
      clearGrid();

      const newGrid = Array.from({ length: Rows }, () => Array(Cols).fill(0));

      const applyPattern = (cells: number[][], offset = { row: 0, col: 0 }) => {
        cells.forEach(([r, c]) => {
          const row = r + offset.row;
          const col = c + offset.col;
          if (row >= 0 && row < Rows && col >= 0 && col < Cols) {
            newGrid[row][col] = 1;
          }
        });
      };

      switch (patternId) {
        case 1: // Glider Gun
          applyPattern(PATTERNS.GLIDER_GUN);
          break;

        case 2: // Pulsar
          applyPattern(PATTERNS.PULSAR);
          break;

        case 3: // Glider
          applyPattern(PATTERNS.GLIDER);
          break;

        case 4: // Spaceship
          applyPattern(PATTERNS.SPACESHIP, SPACESHIP_OFFSET);
          break;

        default:
          console.warn(`Unknown pattern ID: ${patternId}`);
          break;
      }

      setGrid(newGrid);
    },
    [Rows, Cols, clearGrid, setGrid]
  );

  useEffect(() => {
    const initialGrid = Array.from({ length: Rows }, () =>
      Array.from({ length: Cols }, () => (Math.random() > 0.85 ? 1 : 0))
    );
    setGrid(initialGrid);
    resume();
    return pause; 
  }, [resume, pause, Rows, Cols]);

  return (
    <GameContext.Provider
      value={{
        pause,
        resume,
        setAlive,
        clearGrid,
        setGridPattern,
        generation,
        grid,
        setGrid,
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
