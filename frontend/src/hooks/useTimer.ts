import { useState, useRef, useEffect } from "react";

export function useTimer(initialSeconds: number) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setTimeLeft(initialSeconds);
    setIsRunning(false);        // reset and pause if duration changes
  }, [initialSeconds]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = (seconds: number = initialSeconds) => {
    setIsRunning(false);
    setTimeLeft(seconds);
  };

  return { timeLeft, isRunning, start, pause, reset };
}
