import { Reveal, RevealItem } from "./Reveal";
import iconReturns from "../assets/common/imgIconReturns.svg";
import iconShipping from "../assets/common/imgIconShipping.svg";
import iconSecure from "../assets/common/imgIconSecure.svg";
import doubleLine from "../assets/common/imgDoubleLine.svg";

const BADGES = [
  { icon: iconReturns, title: "EASY RETURNS", text: "Hassle-free returns within a few days of purchase." },
  { icon: iconShipping, title: "FAST SHIPPING", text: "Quick and reliable shipping to your preferred location." },
  { icon: iconSecure, title: "SECURE CHECKOUT", text: "Your payment and personal details are safely protected." },
];

export function TrustBadges() {
  return (
    <section className="w-full bg-white">
      <img src={doubleLine} alt="" className="block h-2 w-full" />
      <div className="flex w-full flex-col items-center px-5 py-16 md:p-20">
        <Reveal className="grid w-full max-w-[1280px] grid-cols-1 justify-items-center gap-12 sm:grid-cols-3 sm:gap-6" stagger={0.15}>
          {BADGES.map((badge) => (
            <RevealItem key={badge.title} className="flex w-[250px] flex-col items-center gap-4 text-center">
              <div className="flex size-12 items-center justify-center rounded-full border-[1.2px] border-ink">
                <img src={badge.icon} alt="" className="h-6 w-auto" />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[18px]">{badge.title}</p>
                <p className="text-[16px] font-light">{badge.text}</p>
              </div>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
