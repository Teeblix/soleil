import { Button } from "../../components/ui/Button";
import { Reveal, RevealItem, RevealWords } from "../../components/Reveal";
import storyImage from "../../assets/home/brandStory.jpg";

const POINTS = [
  "We believe swimwear should make you feel confident, comfortable, and effortlessly you.",
  "Quality, fit, and inclusivity are at the heart of everything we create.",
  "From poolside to beach days, we design pieces that flatter real bodies and last beyond a single season.",
];

export function BrandStory() {
  return (
    <section className="flex w-full flex-col items-center px-5 py-16 md:p-20">
      <Reveal className="flex w-full max-w-[1280px] flex-col items-center gap-10 md:flex-row md:gap-[60px]">
        <RevealItem className="h-[380px] w-full overflow-hidden md:h-[570px] md:flex-1">
          <img src={storyImage} alt="Golden hour swimwear" className="h-full w-full object-cover" />
        </RevealItem>
        <Reveal className="flex flex-1 flex-col items-start gap-10" stagger={0.15}>
          <RevealWords
            text="MADE FOR GOLDEN HOUR DAY & CONFIDENCE"
            className="font-display text-[28px] font-medium sm:text-[40px]"
          />
          <div className="flex flex-col items-start gap-4 text-[18px]">
            {POINTS.map((point) => (
              <RevealItem key={point}>
                <p>
                  <span className="mr-2">✦</span>
                  {point}
                </p>
              </RevealItem>
            ))}
          </div>
          <RevealItem>
            <Button to="/about">OUR STORY</Button>
          </RevealItem>
        </Reveal>
      </Reveal>
    </section>
  );
}
