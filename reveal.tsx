import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  as?: "p" | "div" | "span" | "blockquote";
  className?: string;
  children: ReactNode;
  once?: boolean;
};

export function Reveal({
  as: Tag = "p",
  className = "",
  children,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLParagraphElement | HTMLDivElement | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setOn(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setOn(true);
          if (once) io.disconnect();
        } else if (!once) {
          setOn(false);
        }
      },
      { threshold: 0.16, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return (
    <Tag ref={ref as never} className={`${className} ${on ? "is-in" : ""}`.trim()}>
      {children}
    </Tag>
  );
}
