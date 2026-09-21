import { useEffect, useRef, useState } from "react";
import letterJson from "@/data/letter.json";
import archiveJson from "@/data/archive.json";
import { Atmosphere } from "./atmosphere";
import { Door } from "./door";
import { Room } from "./room";
import { Paper } from "./paper";
import { After } from "./after";
import { Chrome } from "./chrome";
import { Observe } from "./observe";
import { Archive } from "./archive";
import { createRoomAudio } from "./audio";
import { tap } from "./haptic";
import type { ArchiveData, LetterData, Mode, Stage } from "./types";

const letter = letterJson as LetterData;
const archive = archiveJson as ArchiveData;

const VISIT_KEY = "a-letter:visited";
const MODE_KEY = "a-letter:mode";

export function LetterExperience() {
  const [stage, setStage] = useState<Stage>("door");
  const [mode, setMode] = useState<Mode>("night");
  const [sound, setSound] = useState(false);
  const [observe, setObserve] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [returning, setReturning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [idle, setIdle] = useState(false);
  const audioRef = useRef<ReturnType<typeof createRoomAudio> | null>(null);
  const idleTimer = useRef<number | null>(null);

  useEffect(() => {
    try {
      setReturning(window.localStorage.getItem(VISIT_KEY) === "1");
      const saved = window.localStorage.getItem(MODE_KEY);
      if (saved === "paper" || saved === "night") setMode(saved);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    document.documentElement.dataset.stage = stage;
    document.body.dataset.mode = mode;
    try {
      window.localStorage.setItem(MODE_KEY, mode);
    } catch {
      /* ignore */
    }
    const theme = mode === "night" ? "#14110f" : "#eadfcb";
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme);
  }, [mode, stage]);

  useEffect(() => {
    return () => {
      audioRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (stage !== "letter") {
      setProgress(0);
      setIdle(false);
      return;
    }

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      setProgress(p);
      const shift = Math.round((p - 0.45) * 36);
      document.documentElement.style.setProperty("--lamp-shift", `${shift}px`);
      document.documentElement.style.setProperty(
        "--lamp-strength",
        String(0.55 + p * 0.28 - Math.max(0, p - 0.82) * 1.4),
      );
      setIdle(false);
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => setIdle(true), 10000);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    idleTimer.current = window.setTimeout(() => setIdle(true), 10000);
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
    };
  }, [stage]);

  const openDoor = () => {
    try {
      window.localStorage.setItem(VISIT_KEY, "1");
    } catch {
      /* ignore */
    }
    setStage("room");
  };

  const toggleSound = () => {
    tap();
    if (!audioRef.current) audioRef.current = createRoomAudio();
    if (sound) {
      audioRef.current.stop();
      setSound(false);
    } else {
      void audioRef.current.start();
      setSound(true);
    }
  };

  return (
    <div className="world" data-stage={stage} data-mode={mode}>
      <Atmosphere
        stage={stage}
        archiveOpen={archiveOpen}
        onOpenArchive={() => {
          tap();
          setArchiveOpen(true);
        }}
      />
      <div className="column">
        {stage === "door" ? <Door returning={returning} onOpen={openDoor} /> : null}
        {stage === "room" ? <Room onRead={() => setStage("letter")} /> : null}
        {stage === "letter" ? (
          <Paper
            letter={letter}
            onLeave={() => {
              window.scrollTo({ top: 0, behavior: "auto" });
              if (sound) {
                audioRef.current?.stop();
                setSound(false);
              }
              setStage("after");
            }}
          />
        ) : null}
        {stage === "after" ? <After /> : null}
      </div>

      <div
        className="thread"
        style={{ ["--read-progress" as string]: `${Math.round(progress * 100)}%` }}
        hidden={stage !== "letter"}
        aria-hidden="true"
      />
      <p className={`idle-line${idle && stage === "letter" ? " is-in" : ""}`}>
        Take your time.
      </p>

      <Chrome
        stage={stage}
        mode={mode}
        sound={sound}
        hidden={observe || archiveOpen}
        onToggleMode={() => {
          tap();
          setMode((m) => (m === "night" ? "paper" : "night"));
        }}
        onToggleSound={toggleSound}
        onObserve={() => {
          tap();
          setObserve(true);
        }}
      />
      <Observe open={observe} onClose={() => setObserve(false)} />
      {archiveOpen ? (
        <Archive data={archive} onClose={() => setArchiveOpen(false)} />
      ) : null}
    </div>
  );
}
