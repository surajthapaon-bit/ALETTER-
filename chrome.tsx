import type { Mode, Stage } from "./types";

type ChromeProps = {
  stage: Stage;
  mode: Mode;
  sound: boolean;
  hidden?: boolean;
  onToggleMode: () => void;
  onToggleSound: () => void;
  onObserve: () => void;
};

export function Chrome({
  stage,
  mode,
  sound,
  hidden,
  onToggleMode,
  onToggleSound,
  onObserve,
}: ChromeProps) {
  if (stage === "door" || stage === "after" || hidden) return null;

  return (
    <nav className="chrome" aria-label="Room">
      <button
        type="button"
        className="chrome-btn"
        aria-pressed={sound}
        onClick={onToggleSound}
      >
        {sound ? "rain · on" : "rain"}
      </button>
      <button type="button" className="chrome-btn" onClick={onToggleMode}>
        {mode === "night" ? "paper" : "night"}
      </button>
      {stage === "letter" ? (
        <button type="button" className="chrome-btn" onClick={onObserve}>
          observe
        </button>
      ) : null}
    </nav>
  );
}
