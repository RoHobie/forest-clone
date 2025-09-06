import { useState } from "react";
import { useTimer } from "../hooks/useTimer";

export default function Timer() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(1); // default 1 min

  const totalSeconds = hours * 3600 + minutes * 60;
  const { timeLeft, isRunning, start, pause, reset } = useTimer(totalSeconds);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center gap-6 mt-10">
      {/* Time Display */}
      <div className="text-4xl font-mono">{formatTime(timeLeft)}</div>

      {/* Dials */}
      <div className="flex gap-6">
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
          <button
            onClick={start}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Start
          </button>
        ) : (
          <button
            onClick={pause}
            className="px-4 py-2 bg-yellow-500 text-white rounded"
          >
            Pause
          </button>
        )}
        <button
          onClick={() => reset(totalSeconds)}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
