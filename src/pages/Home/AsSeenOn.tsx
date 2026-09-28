import { useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { Button } from "../../components/ui/Button";
import { Reveal, RevealItem, RevealWords } from "../../components/Reveal";
import bagIcon from "../../assets/common/imgBagLight.svg";

import celineTile from "../../assets/home/asSeenOn/celineCherryMonokiniTile.jpg";
import celineThumb from "../../assets/home/asSeenOn/celineCherryMonokiniThumb.jpg";
import celineClip from "../../assets/home/asSeenOn/celineCherryMonokini.mp4";

import cherkyTile from "../../assets/home/asSeenOn/cherkySideTieTile.jpg";
import cherkyThumb from "../../assets/home/asSeenOn/cherkySideTieThumb.jpg";
import cherkyClip from "../../assets/home/asSeenOn/cherkySideTie.mp4";

import arlaTile from "../../assets/home/asSeenOn/arlaOnePieceTile.jpg";
import arlaThumb from "../../assets/home/asSeenOn/arlaOnePieceThumb.jpg";
import arlaClip from "../../assets/home/asSeenOn/arlaOnePiece.mp4";

import ginghamTile from "../../assets/home/asSeenOn/ginghamDeiaTile.jpg";
import ginghamThumb from "../../assets/home/asSeenOn/ginghamDeiaThumb.jpg";
import ginghamClip from "../../assets/home/asSeenOn/ginghamDeia.mp4";

const ITEMS = [
  {
    id: "celine-cherry-monokini",
    name: "Celine Cherry Monokini",
    price: "$79.50",
    originalPrice: "$95.00",
    tile: celineTile,
    clip: celineClip,
    thumb: celineThumb,
  },
  {
    id: "cherky-side-tie-bikini",
    name: "Cherky Side-Tie Bikini",
    price: "$39.50",
    originalPrice: "$65.00",
    tile: cherkyTile,
    clip: cherkyClip,
    thumb: cherkyThumb,
  },
  {
    id: "arla-one-piece",
    name: "Arla One Piece",
    price: "$59.50",
    originalPrice: "$85.00",
    tile: arlaTile,
    clip: arlaClip,
    thumb: arlaThumb,
  },
  {
    id: "gingham-deia-top",
    name: "Gingham Deia Top",
    price: "$49.99",
    tile: ginghamTile,
    clip: ginghamClip,
    thumb: ginghamThumb,
  },
];

export function AsSeenOn() {
  const [added, setAdded] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  // Clips only mount once the grid nears the viewport, so 2.1MB of video never
  // touches the initial page load.
  const nearViewport = useInView(gridRef, { once: true, margin: "300px" });
  const reduceMotion = useReducedMotion();
  const playClips = nearViewport && !reduceMotion;

  function handleAdd(id: string) {
    setAdded(id);
    window.setTimeout(() => setAdded((current) => (current === id ? null : current)), 1500);
  }

  return (
    <section className="flex w-full flex-col items-center bg-white px-5 py-16 md:p-20">
      <Reveal className="flex w-full max-w-[1280px] flex-col gap-10">
        <div className="flex items-center justify-between">
          <RevealWords text="AS SEEN ON" className="font-display text-[28px] font-medium sm:text-[40px]" />
          <RevealItem className="hidden sm:block">
            <Button className="sm:w-[221px]">FOLLOW US @SOLEIL</Button>
          </RevealItem>
        </div>
        <div ref={gridRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {ITEMS.map((item) => (
            <RevealItem key={item.id} className="relative h-[400px] w-full overflow-hidden">
              <img src={item.tile} alt="" className="absolute inset-0 h-full w-full object-cover" />
              {playClips && (
                <video
                  src={item.clip}
                  poster={item.tile}
                  autoPlay
                  loop
                  muted
                  playsInline
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(181deg, rgba(0,0,0,0) 70%, rgba(0,0,0,0.8) 92%)",
                }}
              />
              <div className="absolute inset-x-4 bottom-6 flex items-end justify-between gap-2">
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={item.thumb}
                    alt={item.name}
                    className="h-[100px] w-[70px] shrink-0 object-cover sm:w-[85px]"
                  />
                  <div className="flex min-w-0 flex-col items-start gap-2 text-white">
                    <p className="truncate font-display text-[16px] font-medium sm:text-[18px]">
                      {item.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-1">
                      {item.originalPrice && (
                        <span className="text-[13px] text-white/70 line-through sm:text-[14px]">
                          {item.originalPrice}
                        </span>
                      )}
                      <span className="text-[15px] sm:text-[16px]">{item.price}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleAdd(item.id)}
                  aria-label={`Add ${item.name} to cart`}
                  className="flex shrink-0 items-center justify-center bg-ink p-2"
                >
                  <img src={bagIcon} alt="" className="size-[18px]" />
                </button>
              </div>
              {added === item.id && (
                <div className="absolute right-3 top-3 bg-ink px-3 py-1 text-[12px] text-white">
                  Added to cart
                </div>
              )}
            </RevealItem>
          ))}
        </div>
        <RevealItem className="sm:hidden">
          <Button>FOLLOW US @SOLEIL</Button>
        </RevealItem>
      </Reveal>
    </section>
  );
}
