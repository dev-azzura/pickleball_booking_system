import type { ReactNode } from "react";
import Link from "next/link";
import Container from "./container";
import CourtArtwork from "./court-artwork";

type AuthFormLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

export default function AuthFormLayout({ title, description, children, footer }: AuthFormLayoutProps) {
  return (
    <main className="flex flex-1 items-center py-10 sm:py-14">
      <Container className="max-w-6xl">
        <div className="grid overflow-hidden rounded-3xl border border-border bg-white shadow-soft lg:grid-cols-2">
          <aside className="relative isolate overflow-hidden bg-primary p-6 text-white sm:p-9 lg:p-11">
            <div aria-hidden="true" className="absolute -right-14 -top-20 -z-10 size-64 rounded-full border-[34px] border-white/5" />
            <Link href="/" className="inline-flex rounded text-sm font-bold tracking-tight text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
              PickleCourt
            </Link>
            <h2 className="mt-8 max-w-sm text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
              Make room for your next great game.
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/75">
              Find a court, bring your crew, and enjoy more time on the court.
            </p>
            <CourtArtwork variant="championship" className="mt-7 aspect-[1.9] rounded-2xl border border-white/10 sm:mt-9" />
          </aside>

          <section className="flex flex-col justify-center p-6 sm:p-9 lg:p-11">
            <header>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h1>
              <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
            </header>
            <div className="mt-7">{children}</div>
            <div className="mt-7 border-t border-border pt-5 text-center text-sm text-muted">{footer}</div>
          </section>
        </div>
      </Container>
    </main>
  );
}
