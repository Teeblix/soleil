import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A model you turn by dragging, rather than a strip of thumbnails.
 *
 * The component is driven by an ordered ring of frames: position 0 is the
 * front, halfway round is the back, and the far end wraps to the front again.
 * Any number of frames works, so the same component plays a real turntable
 * once more angles exist for a product. With the two we have today it reads as
 * a turn rather than a cut because neighbouring frames are cross-faded by the
 * fractional part of the position instead of being swapped at a threshold.
 */
export function SpinGallery({
  frames,
  alt,
  className = "",
}: {
  frames: string[];
  alt: string;
  className?: string;
}) {
  // Position around the ring, in frames. Kept fractional so the blend is smooth
  // and wrapped into range so dragging never runs out either way.
  const [pos, setPos] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [hinted, setHinted] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const last = useRef(0);
  const animation = useRef(0);

  const count = frames.length;
  const wrap = useCallback((p: number) => ((p % count) + count) % count, [count]);

  // A full drag across the picture turns the model all the way round once.
  const nudge = useCallback(
    (deltaX: number) => {
      const width = box.current?.clientWidth ?? 1;
      setPos((p) => wrap(p + (deltaX / width) * count));
    },
    [count, wrap],
  );

  /** Eases to a whole frame, used by the arrows and the keyboard. */
  const glideTo = useCallback(
    (target: number) => {
      cancelAnimationFrame(animation.current);
      const from = pos;
      const start = performance.now();
      const DURATION = 420;
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION);
        const eased = 1 - Math.pow(1 - t, 3);
        setPos(wrap(from + (target - from) * eased));
        if (t < 1) animation.current = requestAnimationFrame(step);
      };
      animation.current = requestAnimationFrame(step);
    },
    [pos, wrap],
  );

  useEffect(() => () => cancelAnimationFrame(animation.current), []);

  function onPointerDown(e: React.PointerEvent) {
    cancelAnimationFrame(animation.current);
    (e.target as Element).setPointerCapture?.(e.pointerId);
    last.current = e.clientX;
    setDragging(true);
    setHinted(true);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    nudge(e.clientX - last.current);
    last.current = e.clientX;
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!dragging) return;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    setDragging(false);
    // Settle on whichever frame is nearest, so it never rests mid-blend.
    glideTo(Math.round(pos));
  }

  const half = count / 2;
  function turn(direction: 1 | -1) {
    setHinted(true);
    // A press turns half way round, which on a front and back pair is the
    // other side of the garment and on a full turntable is a quarter turn.
    glideTo(pos + direction * Math.max(1, Math.round(half / 2)));
  }

  const base = Math.floor(pos) % count;
  const next = (base + 1) % count;
  const blend = pos - Math.floor(pos);

  return (
    <div
      ref={box}
      className={`relative aspect-[610/626] w-full touch-pan-y overflow-hidden bg-[#eee] select-none ${
        dragging ? "cursor-grabbing" : "cursor-grab"
      } ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="group"
      aria-roledescription="Draggable product view"
      aria-label={`${alt}. Drag, or use the arrow keys, to turn the model.`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); turn(1); }
        if (e.key === "ArrowLeft") { e.preventDefault(); turn(-1); }
      }}
    >
      {frames.map((src, i) => {
        // Only the two frames either side of the position are painted; the
        // rest stay at zero opacity so the browser keeps them decoded.
        const opacity = i === base ? 1 - blend : i === next ? blend : 0;
        return (
          <img
            key={src}
            src={src}
            alt={i === 0 ? alt : ""}
            aria-hidden={i !== 0}
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top"
            style={{ opacity }}
          />
        );
      })}

      <Arrows onTurn={turn} faded={hinted} />
    </div>
  );
}

/** The two curved arrows under the model, as drawn in the design. */
function Arrows({ onTurn, faded }: { onTurn: (d: 1 | -1) => void; faded: boolean }) {
  const common =
    "pointer-events-auto absolute bottom-[7%] flex h-11 w-14 items-center justify-center text-white/90 transition-opacity duration-500 hover:text-white";
  return (
    <div
      className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
        faded ? "opacity-70" : "opacity-100"
      }`}
    >
      <button
        type="button"
        aria-label="Turn left"
        onClick={() => onTurn(-1)}
        className={`${common} left-[22%]`}
      >
        <svg width="46" height="34" viewBox="0 0 46 34" fill="none" aria-hidden="true">
          {/* A shallow arc with a head, so it reads as turning rather than paging. */}
          <path
            d="M44 31C36 13 22 4 4 3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M12 1L3.5 3.2 7 11"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Turn right"
        onClick={() => onTurn(1)}
        className={`${common} right-[22%]`}
      >
        <svg width="46" height="34" viewBox="0 0 46 34" fill="none" aria-hidden="true">
          <path
            d="M2 31C10 13 24 4 42 3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M34 1L42.5 3.2 39 11"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
