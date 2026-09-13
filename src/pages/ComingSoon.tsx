import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex w-full flex-col items-center">
      <Header variant="solid" />
      <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-3 px-5 text-center">
        <p className="font-display text-[32px] font-medium">{title}</p>
        <p className="text-[16px] text-muted">This page is coming soon.</p>
      </div>
      <Footer />
    </div>
  );
}
