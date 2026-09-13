export const EASE = [0.22, 1, 0.36, 1] as const;

export const rise = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.3, ease: "easeIn" as const } },
};
