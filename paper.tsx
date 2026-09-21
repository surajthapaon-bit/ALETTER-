import type { LetterData } from "./types";
import { Reveal } from "./reveal";
import { tap } from "./haptic";

type PaperProps = {
  letter: LetterData;
  onLeave: () => void;
};

export function Paper({ letter, onLeave }: PaperProps) {
  return (
    <article className="stage letter-scroll" aria-label="The letter">
      <div className="paper">
        <span className="paper-tear" aria-hidden="true" />
        <header className="paper-head">
          <span className="hand-date">{letter.date}</span>
          <span className="hand-to">{letter.recipient}</span>
        </header>

        {letter.sections.map((section, index) => (
          <section key={section.id} className="section" id={section.id}>
            {index === letter.sections.length - 1 ? (
              <div className="breath">
                <Reveal as="p" className="breath-line">
                  Before the last part — take one breath.
                </Reveal>
              </div>
            ) : null}

            <span className="section-kicker">{section.heading}</span>

            {section.paragraphs.map((paragraph, i) => (
              <Reveal
                key={`${section.id}-${i}`}
                className={
                  i === 0 && paragraph.endsWith("—") ? "prose-p is-lead" : "prose-p"
                }
              >
                {paragraph}
              </Reveal>
            ))}

            {section.hiddenLine ? (
              <Reveal as="span" className="hidden-line">
                {section.hiddenLine}
              </Reveal>
            ) : null}
          </section>
        ))}

        <footer className="closing">
          <Reveal as="p" className="closing-line">
            {letter.closing}
          </Reveal>
          <Reveal as="div" className="signature">
            {letter.signature}
          </Reveal>
          <Reveal as="div" className="flourish">
            <svg viewBox="0 0 120 18" aria-hidden="true">
              <path d="M2 11 C 18 4, 28 16, 44 9 S 72 4, 88 11 110 8, 118 10" />
            </svg>
          </Reveal>
        </footer>
      </div>

      <div className="silence">
        <p className="silence-line">That's all. That's the whole letter.</p>
        <p className="silence-line soft">Now sit with it.</p>
        <p className="humanity-mark">Without losing my humanity • 2026.</p>
      </div>

      <div className="leave-wrap">
        <button
          type="button"
          className="whisper-btn is-ready"
          onClick={() => {
            tap();
            onLeave();
          }}
        >
          Leave the room
        </button>
      </div>
    </article>
  );
}
