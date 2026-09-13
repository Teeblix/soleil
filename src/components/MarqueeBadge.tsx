const WORDS = ["NEW IN", "EXCLUSIVE"];

export function MarqueeBadge({ className = "" }: { className?: string }) {
  const track = [...WORDS, ...WORDS, ...WORDS];
  return (
    <div
      className={`absolute h-[21px] w-[90px] overflow-hidden sm:w-[118px] ${className}`}
      aria-hidden="true"
    >
      <div className="animate-marquee flex w-max items-center whitespace-nowrap text-[13px] font-light sm:text-[16px] tracking-[0.32px] text-ink">
        {track.map((word, i) => (
          <span key={i} className="pr-4">
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}
