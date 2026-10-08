import type { ReactNode } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
