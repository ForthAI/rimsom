import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RevealWrapper from "@/components/RevealWrapper";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>
        <RevealWrapper>{children}</RevealWrapper>
      </main>
      <Footer />
    </>
  );
}
