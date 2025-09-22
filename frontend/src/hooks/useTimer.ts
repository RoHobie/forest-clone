
import { useState, useRef, useEffect, useCallback } from "react";

const API_BASE = "http://localhost:8080";

type Timer = {
  id: string;
  duration: number;
  status: string;
  startedAt: string;
};

export function useTimer(initialSeconds: number) {
  const [timerId, setTimerId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<string>("idle");
  const pollRef = useRef<number | null>(null);

  // Helper to calculate time left from backend timer
  const calcTimeLeft = (timer: Timer) => {
    const started = new Date(timer.startedAt).getTime();
    const now = Date.now();
    const elapsed = Math.floor((now - started) / 1000);
    return Math.max(timer.duration * 60 - elapsed, 0);
  };

  // Start timer (POST to backend)
  const start = useCallback(async (durationSeconds?: number) => {
    const duration = Math.ceil((durationSeconds ?? initialSeconds) / 60) || 1;
    const res = await fetch(`${API_BASE}/timer/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ duration }),
    });
    if (!res.ok) return;
    const timer: Timer = await res.json();
    setTimerId(timer.id);
    setIsRunning(true);
    setStatus("running");
    setTimeLeft(timer.duration * 60);
  }, [initialSeconds]);

  // Stop timer (POST to backend)
  const stop = useCallback(async () => {
    if (!timerId) return;
    await fetch(`${API_BASE}/timer/stop/${timerId}`, { method: "POST" });
    setIsRunning(false);
    setStatus("stopped");
  }, [timerId]);

  // Poll backend for timer updates
  useEffect(() => {
    if (!timerId || !isRunning) return;
    pollRef.current = window.setInterval(async () => {
      const res = await fetch(`${API_BASE}/timer/${timerId}`);
      if (!res.ok) return;
      const timer: Timer = await res.json();
      setStatus(timer.status);
      setTimeLeft(calcTimeLeft(timer));
      if (timer.status !== "running" || calcTimeLeft(timer) <= 0) {
        setIsRunning(false);
        clearInterval(pollRef.current!);
      }
    }, 1000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [timerId, isRunning]);

  // Reset timer (clear backend state)
  const reset = useCallback((seconds: number = initialSeconds) => {
    setTimerId(null);
    setIsRunning(false);
    setStatus("idle");
    setTimeLeft(seconds);
  }, [initialSeconds]);

  return { timeLeft, isRunning, status, start, stop, reset };
}
