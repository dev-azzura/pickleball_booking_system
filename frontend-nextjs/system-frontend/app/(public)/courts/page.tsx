import type { Metadata } from "next";
import Container from "@/app/components/container";
import CourtListing from "@/app/components/court-listing";
import { courts } from "@/app/data/courts";

export const metadata: Metadata = {
  title: "Find Your Perfect Court | PickleCourt",
  description: "Explore our pickleball courts and find the perfect place for your next game.",
};

export default function CourtsPage() {
  return (
    <main className="flex-1 pb-16 sm:pb-20">
      <section className="bg-primary py-14 sm:py-16 lg:py-20">
        <Container>
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent sm:text-sm">
            <span aria-hidden="true" className="h-0.5 w-9 rounded-full bg-accent" />
            Find Your Perfect Court
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Find Your Next <span className="text-accent">Place to Play.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#D1E2DB] sm:mt-6 sm:text-lg sm:leading-8">
            Explore indoor and outdoor pickleball courts, compare facilities, and find the perfect spot for your next match.
          </p>
        </Container>
      </section>

      <Container className="py-8 sm:py-10 lg:py-12">
        <CourtListing courts={courts} />
      </Container>
    </main>
  );
}
