import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Reveal, RevealItem, RevealWords } from "../../components/Reveal";
import topsImg from "../../assets/home/categories/tops.jpg";
import bottomsImg from "../../assets/home/categories/bottoms.jpg";
import setsImg from "../../assets/home/categories/sets.jpg";

const CATEGORIES = [
  { label: "TOPS", image: topsImg, to: "/products?category=tops", height: "h-[420px] sm:h-[500px]", span: "", focus: "" },
  { label: "BOTTOMS", image: bottomsImg, to: "/products?category=bottoms", height: "h-[420px] sm:h-[428px]", span: "", focus: "" },
  // Spans both tablet columns, so it crops wide - anchor the top to keep the model's head.
  { label: "SETS", image: setsImg, to: "/products?category=sets", height: "h-[420px] sm:h-[500px]", span: "sm:col-span-2 lg:col-span-1", focus: "sm:object-top lg:object-center" },
];

export function ShopByCategory() {
  return (
    <section className="flex w-full flex-col items-center px-5 py-16 md:p-20">
      <Reveal className="flex w-full max-w-[1280px] flex-col gap-10">
        <div className="flex items-center justify-between">
          <RevealWords text="SHOP BY CATEGORY" className="font-display text-[28px] font-medium sm:text-[40px]" />
          <RevealItem className="hidden sm:block">
            <Button to="/collections">EXPLORE ALL</Button>
          </RevealItem>
        </div>
        <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <RevealItem key={cat.label} className={cat.span}>
              <Link to={cat.to} className={`group relative block w-full overflow-hidden ${cat.height}`}>
                <img
                  src={cat.image}
                  alt={cat.label}
                  className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${cat.focus}`}
                />
                <div className="absolute inset-0 bg-black/20" />

                <div className="absolute inset-x-0 bottom-20 flex flex-col items-center text-white">
                  <p className="font-display text-[32px] font-medium">{cat.label}</p>
                  <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover:grid-rows-[1fr]">
                    <div className="overflow-hidden">
                      <span className="flex flex-col pt-3 opacity-0 transition-opacity delay-100 duration-500 group-hover:opacity-100">
                        <span className="text-[16px] leading-none tracking-[0.8px]">EXPLORE</span>
                        <span className="mt-0.5 h-px w-full origin-left scale-x-0 bg-white transition-transform delay-200 duration-500 ease-in-out group-hover:scale-x-100" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </RevealItem>
          ))}
        </div>
        <RevealItem className="sm:hidden">
          <Button to="/collections">EXPLORE ALL</Button>
        </RevealItem>
      </Reveal>
    </section>
  );
}
