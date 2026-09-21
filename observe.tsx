import { useEffect, useId, useRef } from "react";

type ObserveProps = {
  open: boolean;
  onClose: () => void;
};

export function Observe({ open, onClose }: ObserveProps) {
  const id = useId();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) {
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    const t = window.setTimeout(() => inputRef.current?.focus(), 400);
    return () => window.clearTimeout(t);
  }, [open]);

  return (
    <>
      <div
        className={`observe-backdrop${open ? " is-open" : ""}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={`observe-drawer${open ? " is-open" : ""}`}
        role="dialog"
        aria-labelledby={id}
        aria-hidden={!open}
        inert={!open ? true : undefined}
      >
        <p className="observe-kicker" id={id}>
          observe.
        </p>
        <p className="observe-help">
          Write what this brings up. Nothing is saved. It disappears when you close it.
        </p>
        <textarea
          ref={inputRef}
          className="observe-input"
          aria-label="Your reflection"
          spellCheck={false}
        />
        <button type="button" className="observe-close" onClick={onClose}>
          close
        </button>
      </aside>
    </>
  );
}
