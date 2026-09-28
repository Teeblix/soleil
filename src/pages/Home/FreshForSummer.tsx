import { Button } from "../../components/ui/Button";
import { Reveal, RevealItem, RevealWords } from "../../components/Reveal";
import { ProductCard, type ColorVariant } from "./ProductCard";

import p1PinkDefault from "../../assets/home/products/p1PinkDefault.webp";
import p1PinkHover from "../../assets/home/products/p1PinkHover.webp";
import p1BrownDefault from "../../assets/home/products/p1BrownDefault.webp";
import p1BrownHover from "../../assets/home/products/p1BrownHover.webp";

import p2Default from "../../assets/home/products/p2Default.webp";
import p2Hover from "../../assets/home/products/p2Hover.webp";

import p3Default from "../../assets/home/products/p3Default.webp";
import p3Hover from "../../assets/home/products/p3Hover.webp";

import p4Default from "../../assets/home/products/p4Default.webp";
import p4Hover from "../../assets/home/products/p4Hover.webp";

const PINK = "#FABFD0";
const BROWN = "#4A2F23";

type Product = {
  name: string;
  price: string;
  colors: ColorVariant[];
};

const PRODUCTS: Product[] = [
  {
    name: "Three Piece Mesh Bikini",
    price: "$109.50",
    colors: [
      { name: "Pink", swatch: PINK, defaultImage: p1PinkDefault, hoverImage: p1PinkHover },
      { name: "Brown", swatch: BROWN, defaultImage: p1BrownDefault, hoverImage: p1BrownHover },
    ],
  },
  {
    name: "One Piece Cutout Swimsuit",
    price: "$69.50",
    colors: [{ name: "Green", swatch: "#2E7D46", defaultImage: p2Default, hoverImage: p2Hover }],
  },
  {
    name: "One Piece Cruisin Ribbed",
    price: "$49.00",
    colors: [{ name: "Black", swatch: "#0D0D0D", defaultImage: p3Default, hoverImage: p3Hover }],
  },
  {
    name: "One Piece Strappy Swimsuit",
    price: "$66.90",
    colors: [{ name: "Blue", swatch: "#2E6FE0", defaultImage: p4Default, hoverImage: p4Hover }],
  },
];

export function FreshForSummer() {
  return (
    <section className="flex w-full flex-col items-center bg-white px-5 py-16 md:p-20">
      <Reveal className="flex w-full max-w-[1280px] flex-col gap-10">
        <div className="flex items-center justify-between">
          <RevealWords text="FRESH FOR SUMMER" className="font-display text-[28px] font-medium sm:text-[40px]" />
          <RevealItem className="hidden sm:block">
            <Button to="/products">VIEW ALL</Button>
          </RevealItem>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((product) => (
            <RevealItem key={product.name}>
              <ProductCard
                name={product.name}
                price={product.price}
                to="/products"
                colors={product.colors}
              />
            </RevealItem>
          ))}
        </div>
        <RevealItem className="sm:hidden">
          <Button to="/products">VIEW ALL</Button>
        </RevealItem>
      </Reveal>
    </section>
  );
}
