import { tap } from "./haptic";

const LINES = [
  "She was written to on September 2026.",
  "She may never read this.",
  "But the letter is here.",
  "It has been waiting.",
];

type RoomProps = {
  onRead: () => void;
};

export function Room({ onRead }: RoomProps) {
  return (
    <section className="stage stage-screen" aria-label="The room">
      <div className="room-copy">
        {LINES.map((line, i) => (
          <p
            key={line}
            className="room-line"
            style={{ animationDelay: `${400 + i * 900}ms` }}
          >
            {line}
          </p>
        ))}
      </div>
      <button
        type="button"
        className="whisper-btn room-cta"
        style={{ animationDelay: "4200ms" }}
        onClick={() => {
          tap();
          onRead();
        }}
      >
        Read the letter
      </button>
    </section>
  );
}
