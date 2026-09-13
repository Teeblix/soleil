import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Reveal, RevealItem } from "../../components/Reveal";
import ctaImage from "../../assets/home/hero/readyForTheSun.jpg";

// Flip to false once the export without baked-in text is dropped in.
const IMAGE_HAS_BAKED_TEXT = true;

export function FinalCta() {
  return (
    <section className="relative w-full px-5 md:px-20">
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-cream" />
      <Reveal>
        <RevealItem className="relative mx-auto aspect-[8/5] w-full max-w-[1280px] overflow-hidden">
          <img
            src={ctaImage}
            alt="Ready for the sun? Shop collections"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {IMAGE_HAS_BAKED_TEXT ? (
            <Link
              to="/collections"
              aria-label="Shop collections"
              className="absolute inset-0"
            />
          ) : (
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 px-5 pb-10 text-center text-white md:pb-20">
              <p className="font-display text-[28px] font-medium sm:text-[40px]">
                READY FOR THE SUN?
              </p>
              <p className="max-w-[720px] text-[16px] font-light sm:text-[18px]">
                Soleil is made for moments like this. Find your perfect fit and
                make this summer unforgettable.
              </p>
              <Button
                to="/collections"
                variant="outline-light"
                className="mt-2 w-[221px]"
              >
                SHOP COLLECTIONS
              </Button>
            </div>
          )}
        </RevealItem>
      </Reveal>
    </section>
  );
}
