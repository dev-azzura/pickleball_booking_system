"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef, useState, type KeyboardEvent } from "react";
import Button from "./button";
import Container from "./container";

const navigation = [
  { label: "Home", href: "/" },
  { label: "My Bookings", href: "/bookings" },
];

function isRouteActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const courtsActive = isRouteActive(pathname, "/courts");

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleMenuKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      closeMenu();
      menuButtonRef.current?.focus();
    }
  }

  return (
    <header className="sticky top-0 z-30 bg-background/90 px-3 pt-3 pb-3 backdrop-blur sm:px-4 sm:pt-4 sm:pb-4">
      <Container className="relative">
        <div className="flex min-h-16 items-center justify-between gap-3 rounded-2xl border border-border/90 bg-white px-3 shadow-[0_8px_28px_rgba(22,74,65,0.09)] sm:px-5 lg:px-6">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5 rounded-lg text-lg font-extrabold tracking-tight text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:text-xl"
            aria-label="PickleCourt home"
            aria-current={pathname === "/" ? "page" : undefined}
            onClick={closeMenu}
          >
            <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg border border-border/70 bg-white">
              <Image src="/img/logo.png" alt="" width={40} height={40} priority className="size-full object-contain" />
            </span>
            PickleCourt
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex lg:gap-3">
            {navigation.map((item) => {
              const active = isRouteActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-lg px-3 py-2 text-sm transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:px-4 ${active ? "font-semibold text-primary before:absolute before:inset-x-3 before:-bottom-0.5 before:h-0.5 before:rounded-full before:bg-accent lg:before:inset-x-4" : "font-medium text-muted"}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 md:flex">
            <Link
              href="/login"
              className={`inline-flex min-h-10 items-center rounded-xl px-3 text-sm transition-colors hover:bg-primary/5 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${isRouteActive(pathname, "/login") ? "font-semibold text-primary" : "font-medium text-muted"}`}
              aria-current={isRouteActive(pathname, "/login") ? "page" : undefined}
            >
              Login
            </Link>
            <Link
              href="/register"
              className={`inline-flex min-h-10 items-center rounded-xl px-3 text-sm transition-colors hover:bg-primary/5 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${isRouteActive(pathname, "/register") ? "font-semibold text-primary" : "font-medium text-muted"}`}
              aria-current={isRouteActive(pathname, "/register") ? "page" : undefined}
            >
              Register
            </Link>
            <Button
              href="/courts"
              aria-current={courtsActive ? "page" : undefined}
              className={`ml-1 min-h-11 gap-2 rounded-xl bg-accent px-4 text-sm font-bold text-primary shadow-sm hover:bg-[#d4f695] focus-visible:outline-primary ${courtsActive ? "ring-2 ring-primary/20" : ""}`}
            >
              Explore Courts
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-4">
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
            </Button>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-white text-primary transition-colors hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:hidden"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            ) : (
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>

        {menuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            onKeyDown={handleMenuKeyDown}
            className="absolute left-4 right-4 top-[calc(100%+0.5rem)] rounded-2xl border border-border bg-white p-3 shadow-[0_14px_36px_rgba(22,74,65,0.14)] md:hidden"
          >
            <div className="flex flex-col gap-1">
              {navigation.map((item) => {
                const active = isRouteActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`min-h-11 rounded-xl px-3 py-3 text-sm transition-colors hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-primary ${active ? "bg-[#f0f6e8] font-semibold text-primary" : "font-medium text-foreground"}`}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border pt-3">
                <Link
                  href="/login"
                  aria-current={isRouteActive(pathname, "/login") ? "page" : undefined}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border px-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-primary"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  aria-current={isRouteActive(pathname, "/register") ? "page" : undefined}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border px-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-primary"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </div>
              <Button
                href="/courts"
                aria-current={courtsActive ? "page" : undefined}
                className="mt-1 min-h-11 w-full gap-2 rounded-xl bg-accent px-4 text-sm font-bold text-primary hover:bg-[#d4f695] focus-visible:outline-primary"
                onClick={closeMenu}
              >
                Explore Courts
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-4">
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </Button>
            </div>
          </nav>
        )}
      </Container>
    </header>
  );
}
