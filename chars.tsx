type CharsProps = {
  text: string;
  delay?: number;
  step?: number;
};

export function Chars({ text, delay = 0, step = 46 }: CharsProps) {
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <span
          key={`${i}-${ch}`}
          className="char"
          style={{ animationDelay: `${delay + i * step}ms` }}
        >
          {ch}
        </span>
      ))}
    </>
  );
}
