import { Chars } from "./chars";
import { tap } from "./haptic";

type DoorProps = {
  returning: boolean;
  onOpen: () => void;
};

export function Door({ returning, onOpen }: DoorProps) {
  return (
    <section className="stage stage-screen" aria-label="The door">
      <div className="door-lines">
        <p className="door-line">
          <Chars text="You found the door." delay={320} />
        </p>
        <p className="door-line">
          <Chars text="Enter slowly. What's inside was written slowly." delay={2100} step={38} />
        </p>
        {returning ? (
          <p className="door-return">
            <Chars
              text="You've been here before. The letter is still here. It always will be."
              delay={4600}
              step={28}
            />
          </p>
        ) : null}
        <button
          type="button"
          className="whisper-btn"
          style={{ animationDelay: returning ? "7600ms" : "5200ms" }}
          onClick={() => {
            tap();
            onOpen();
          }}
        >
          Open
        </button>
      </div>
    </section>
  );
}
