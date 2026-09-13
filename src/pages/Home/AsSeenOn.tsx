import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Reveal, RevealItem, RevealWords } from "../../components/Reveal";
import bagIcon from "../../assets/common/imgBagLight.svg";
import tile1 from "../../assets/home/imgFrame9.jpg";
import thumb1 from "../../assets/home/imgFrame7.jpg";
import tile2 from "../../assets/home/imgFrame12.jpg";
import thumb2 from "../../assets/home/imgFrame8.jpg";
import tile3 from "../../assets/home/imgFrame10.jpg";
import thumb3 from "../../assets/home/imgFrame11.jpg";
import tile4 from "../../assets/home/imgFrame13.jpg";
import thumb4 from "../../assets/home/imgFrame14.jpg";

const ITEMS = [
  {
    id: "celine-cherry-monokini",
    name: "Celine Cherry Monokini",
    price: "$79.50",
    originalPrice: "$95.00",
    tile: tile1,
    thumb: thumb1,
  },
  {
    id: "cherky-side-tie-bikini",
    name: "Cherky Side-Tie Bikini",
    price: "$39.50",
    originalPrice: "$65.00",
    tile: tile2,
    thumb: thumb2,
  },
  {
    id: "arla-one-piece",
    name: "Arla One Piece",
    price: "$59.50",
    originalPrice: "$85.00",
    tile: tile3,
    thumb: thumb3,
  },
  {
    id: "gingham-deia-top",
    name: "Gingham Deia Top",
    price: "$49.99",
    tile: tile4,
    thumb: thumb4,
  },
];

export function AsSeenOn() {
  const [added, setAdded] = useState<string | null>(null);

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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {ITEMS.map((item) => (
            <RevealItem key={item.id} className="relative h-[400px] w-full overflow-hidden">
              <img src={item.tile} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div
                className="absolute inset-0 backdrop-blur-[2px]"
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
