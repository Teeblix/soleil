import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

type Variant = "outline" | "outline-light" | "solid";

type CommonProps = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { to?: undefined };

type ButtonAsLink = CommonProps & { to: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const base =
  "relative isolate inline-flex items-center justify-center overflow-hidden px-3 py-4 text-[16px] font-normal tracking-[0.8px] transition-colors duration-300 " +
  "before:absolute before:inset-0 before:-z-10 before:origin-bottom before:scale-y-0 before:transition-transform before:duration-300 before:ease-out before:content-[''] hover:before:scale-y-100";

const variants: Record<Variant, string> = {
  outline: "border border-ink text-ink before:bg-ink hover:text-white",
  "outline-light": "border-[0.75px] border-white text-white font-light before:bg-white hover:text-ink",
  solid: "bg-ink text-white border border-ink before:bg-white/15",
};

export function Button({ variant = "outline", className = "", children, ...props }: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if ("to" in props && props.to) {
    return (
      <Link to={props.to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
