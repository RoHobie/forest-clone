import { useState, useRef, useEffect, useCallback } from "react";

const API_BASE = "http://localhost:8080";

type Timer = {
  id: string;
  duration: number;
  status: string;
  startedAt: string;
  pausedAt?: string;
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
    // if paused, use pausedAt so elapsed doesn't include paused duration
    const now =
      timer.status === "paused" && timer.pausedAt
        ? new Date(timer.pausedAt).getTime()
        : Date.now();
    const elapsed = Math.floor((now - started) / 1000);
    return Math.max(timer.duration * 60 - elapsed, 0);
  };

  // Start timer (POST to backend)
  const start = useCallback(
    async (durationSeconds?: number) => {
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
    },
    [initialSeconds]
  );

  // Pause timer (POST to backend) - fetch updated timer and set local state
  const pause = useCallback(async () => {
    if (!timerId) return;
    const res = await fetch(`${API_BASE}/timer/pause/${timerId}`, { method: "POST" });
    if (!res.ok) return;
    const timer: Timer = await res.json();
    // stop local polling immediately
    setIsRunning(false);
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    setStatus(timer.status);
    setTimeLeft(calcTimeLeft(timer));
  }, [timerId]);

  // Resume timer (POST to backend)
  const resume = useCallback(async () => {
    if (!timerId) return;
    const res = await fetch(`${API_BASE}/timer/resume/${timerId}`, { method: "POST" });
    if (!res.ok) return;
    const timer: Timer = await res.json();
    setIsRunning(true);
    setStatus(timer.status);
    setTimeLeft(calcTimeLeft(timer));
  }, [timerId]);

  // Poll backend for timer updates whenever we have a timerId AND the timer is running
  useEffect(() => {
    if (!timerId || !isRunning) return;
    // ensure no duplicate interval
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    pollRef.current = window.setInterval(async () => {
      const res = await fetch(`${API_BASE}/timer/${timerId}`);
      if (!res.ok) return;
      const timer: Timer = await res.json();
      setStatus(timer.status);
      setTimeLeft(calcTimeLeft(timer));
      // stop polling when finished
      if (calcTimeLeft(timer) <= 0) {
        setIsRunning(false);
        if (pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
      }
    }, 1000);
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [timerId, isRunning]);

  // Reset timer (clear backend state)
  const reset = useCallback(
    (seconds: number = initialSeconds) => {
      // clear polling immediately
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
      setTimerId(null);
      setIsRunning(false);
      setStatus("idle");
      setTimeLeft(seconds);
    },
    [initialSeconds]
  );

  return { timeLeft, isRunning, status, start, pause, resume, reset };
}
