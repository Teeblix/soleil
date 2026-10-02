import { useRef, type PointerEvent } from "react";
import { motion, useAnimationFrame, useMotionValue } from "motion/react";
import { Reveal, RevealItem, RevealWords } from "./Reveal";
import mayaImg from "../assets/home/testimonials/maya.jpg";
import chloeImg from "../assets/home/testimonials/chloe.jpg";
import emmaImg from "../assets/home/testimonials/emma.jpg";
import zaraImg from "../assets/home/testimonials/zara.jpg";
import jessImg from "../assets/home/testimonials/jess.jpg";

const TESTIMONIALS = [
  { quote: "Got so many compliments on this... People kept asking where it's from.", name: "Maya S.", image: mayaImg, height: 400, offset: 0 },
  { quote: "Finally a bikini that stays in place when I'm actually swimming.", name: "Chloe M.", image: chloeImg, height: 302, offset: 49 },
  { quote: "The fit is so comfortable I forget I'm wearing it.", name: "Emma A.", image: emmaImg, height: 400, offset: 0 },
  { quote: "This is now my go-to, wore it all summer and it still looks brand new.", name: "Zara J.", image: zaraImg, height: 204, offset: 98 },
  { quote: "I was nervous about ordering online but the size guide was spot on.", name: "Jess L.", image: jessImg, height: 302, offset: 49 },
];

const CARD_WIDTH = 302;
const GAP = 48;
const PERIOD = TESTIMONIALS.length * (CARD_WIDTH + GAP);
const COPIES = 3;
const BASE_SPEED = 70;
const GLIDE_MS = 520;
const HOVER_SPEED = 26;

const wrap = (value: number) => ((value % PERIOD) + PERIOD) % PERIOD - PERIOD;

function Card({ quote, name, image, height, offset }: (typeof TESTIMONIALS)[number]) {
  return (
    <div className="flex shrink-0 flex-col items-start gap-3" style={{ width: CARD_WIDTH, marginTop: offset }}>
      <div className="w-full overflow-hidden" style={{ height }}>
        <img src={image} alt={name} draggable={false} className="h-full w-full object-cover object-top" />
      </div>
      <div className="flex flex-col items-start gap-2 text-[16px]">
        <p className="font-light">{quote}</p>
        <p>{name}</p>
      </div>
    </div>
  );
}

export function Testimonials({
  heading = "WHAT OUR CUSTOMERS SAY",
  intro = "From poolside to beach days, our customers share what they love about their favorite pieces.",
}: {
  heading?: string;
  /** Omitted on the product page, where the rail runs straight under the title. */
  intro?: string | null;
} = {}) {
  const x = useMotionValue(0);
  const speed = useRef(BASE_SPEED);
  const hovering = useRef(false);
  const inertia = useRef(0);
  const drag = useRef({ active: false, startX: 0, startValue: 0, lastX: 0, lastTime: 0, velocity: 0 });
  // An arrow press is a timed glide rather than a shove, so a run of presses
  // steps card by card instead of piling up speed the way inertia would.
  const glide = useRef<{ from: number; to: number; start: number } | null>(null);

  useAnimationFrame((_, delta) => {
    const dt = Math.min(delta, 64) / 1000;
    const target = hovering.current ? HOVER_SPEED : BASE_SPEED;
    speed.current += (target - speed.current) * Math.min(1, dt * 4);

    if (drag.current.active) return;

    const g = glide.current;
    if (g) {
      const t = Math.min(1, (performance.now() - g.start) / GLIDE_MS);
      const eased = 1 - Math.pow(1 - t, 3);
      x.set(wrap(g.from + (g.to - g.from) * eased));
      if (t >= 1) glide.current = null;
      return;
    }

    let next = x.get() - speed.current * dt;
    if (Math.abs(inertia.current) > 2) {
      next += inertia.current * dt;
      inertia.current *= Math.pow(0.08, dt);
    } else {
      inertia.current = 0;
    }
    x.set(wrap(next));
  });

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { active: true, startX: e.clientX, startValue: x.get(), lastX: e.clientX, lastTime: performance.now(), velocity: 0 };
    inertia.current = 0;
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d.active) return;
    const now = performance.now();
    const elapsed = Math.max(now - d.lastTime, 1) / 1000;
    d.velocity = (e.clientX - d.lastX) / elapsed;
    d.lastX = e.clientX;
    d.lastTime = now;
    x.set(wrap(d.startValue + (e.clientX - d.startX)));
  }

  function onPointerUp() {
    if (!drag.current.active) return;
    drag.current.active = false;
    inertia.current = Math.max(-1500, Math.min(1500, drag.current.velocity));
  }

  function step(direction: 1 | -1) {
    inertia.current = 0;
    const from = glide.current ? glide.current.to : x.get();
    glide.current = { from, to: from - direction * (CARD_WIDTH + GAP), start: performance.now() };
  }

  return (
    <Reveal className="flex w-full flex-col items-center gap-10 py-16 md:py-20">
      <div className="flex flex-col items-center gap-4 px-5 text-center">
        <RevealWords text={heading} className="font-display text-[28px] font-medium sm:text-[40px]" />
        {intro && (
          <RevealItem>
            <p className="max-w-[664px] text-[18px] font-light sm:text-[20px]">{intro}</p>
          </RevealItem>
        )}
      </div>
      <RevealItem className="w-full">
        <div
          className="w-full cursor-grab select-none overflow-hidden active:cursor-grabbing"
          style={{ touchAction: "pan-y" }}
          onMouseEnter={() => (hovering.current = true)}
          onMouseLeave={() => (hovering.current = false)}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <motion.div style={{ x, gap: GAP }} className="flex w-max items-start">
            {Array.from({ length: COPIES }).flatMap((_, copy) =>
              TESTIMONIALS.map((t, i) => <Card key={`${copy}-${i}`} {...t} />),
            )}
          </motion.div>
        </div>
      </RevealItem>

      <RevealItem>
        <div className="flex items-center gap-[22px]">
          <RailArrow direction={-1} onClick={() => step(-1)} />
          <RailArrow direction={1} onClick={() => step(1)} />
        </div>
      </RevealItem>
    </Reveal>
  );
}

/** The two round steppers under the rail. */
function RailArrow({ direction, onClick }: { direction: 1 | -1; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === 1 ? "Next testimonials" : "Previous testimonials"}
      className="flex size-[34px] items-center justify-center rounded-full border border-line text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-white"
    >
      <svg width="6" height="10" viewBox="0 0 6 10" fill="none" aria-hidden="true"
           className={direction === -1 ? "rotate-180" : ""}>
        <path d="M1 1l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
