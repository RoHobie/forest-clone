
import { useState, useEffect } from "react";
import { useTimer } from "../hooks/useTimer";
import { Button } from "@/components/ui/button"

export default function Timer() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(1);
  const totalSeconds = hours * 3600 + minutes * 60;
  const { timeLeft, isRunning, status, start, pause, reset } = useTimer(totalSeconds);

  // When duration changes, reset timer
  useEffect(() => {
    reset(totalSeconds);
  }, [hours, minutes]);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex justify-center items-center min-h-screen min-w-screen bg-gray-900 ">
    <div className="flex flex-col items-center gap-6 mt-10">
      {/* Time Display */}
      <div className="text-4xl font-mono text-white">{formatTime(timeLeft)}</div>
      <div className="text-sm text-white">Status: {status}</div>

      {/* Dials */}
      <div className="flex gap-6 text-white">
        <div className="flex flex-col items-center">
          <label className="mb-2">Hours</label>
          <input
            type="range"
            min={0}
            max={12}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-40"
          />
          <span>{hours}</span>
        </div>
        <div className="flex flex-col items-center">
          <label className="mb-2">Minutes</label>
          <input
            type="range"
            min={0}
            max={59}
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            className="w-40"
          />
          <span>{minutes}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        {!isRunning ? (
          <Button
            onClick={() => start(totalSeconds)}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Start
          </Button>
        ) : (
          <Button
            onClick={pause}
            className="px-4 py-2 bg-yellow-500 text-white rounded"
          >
            Pause
          </Button>
        )}
        <Button
          onClick={() => reset(totalSeconds)}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Reset
        </Button>
      </div>
    </div>
    </div>
  );
}
