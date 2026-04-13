import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RevealWrapper from "@/components/RevealWrapper";
import SiteGate from "@/components/SiteGate";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SiteGate>
      <Header />
      <main>
        <RevealWrapper>{children}</RevealWrapper>
      </main>
      <Footer />
    </SiteGate>
  );
}
