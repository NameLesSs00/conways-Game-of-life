"use client";
import { useState, createContext, ReactNode, useContext, useRef, useEffect, useCallback } from "react";

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

  // Game logic
  const nextGeneration = useCallback(() => {
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

          newGrid[r][c] = prevGrid[r][c] 
            ? (liveNeighbors === 2 || liveNeighbors === 3) ? 1 : 0
            : (liveNeighbors === 3) ? 1 : 0;
        }
      }
      return newGrid;
    });
    setGeneration(prev => prev + 1);
  }, [Rows, Cols]);

  // Game controls
  const resume = useCallback(() => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(nextGeneration, 500);
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
    setGrid(prevGrid => {
      const newGrid = [...prevGrid];
      newGrid[row] = [...prevGrid[row]];
      newGrid[row][col] = prevGrid[row][col] === 0 ? 1 : 0;
      return newGrid;
    });
  }, []);

  const setGridPattern = useCallback((patternId: number) => {
    clearGrid();
    const newGrid = Array.from({ length: Rows }, () => Array(Cols).fill(0));

    // Glider pattern
    if (patternId === 1) {
      const glider = [[0,1],[1,2],[2,0],[2,1],[2,2]];
      glider.forEach(([r, c]) => {
        if (r < Rows && c < Cols) newGrid[r][c] = 1;
      });
    }
    // Lightweight spaceship
    else if (patternId === 2) {
      const lwss = [[0,1],[0,4],[1,0],[2,0],[2,4],[3,0],[3,1],[3,2],[3,3]];
      lwss.forEach(([r, c]) => {
        if (r < Rows && c < Cols) newGrid[r][c] = 1;
      });
    }

    setGrid(newGrid);
  }, [Rows, Cols, clearGrid]);

  // Initialize game
  useEffect(() => {
    const initialGrid = Array.from({ length: Rows }, () =>
      Array.from({ length: Cols }, () => (Math.random() > 0.85 ? 1 : 0))
    );
    setGrid(initialGrid);
    resume();
    return pause; // Cleanup on unmount
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