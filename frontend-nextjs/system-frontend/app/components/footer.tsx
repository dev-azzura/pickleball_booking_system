import Link from "next/link";
import Image from "next/image";
import Container from "./container";

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "Find Courts", href: "/courts" },
  { label: "How It Works", href: "/#how-it-works" },
];

const accountLinks = [
  { label: "My Bookings", href: "/bookings" },
  { label: "Login", href: "/login" },
  { label: "Register", href: "/register" },
];

const footerLinkStyles =
  "inline-flex min-h-8 items-center rounded-sm text-sm text-[#D1E2DB] transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent motion-reduce:transition-none";

function FooterLinkGroup({ title, links, label }: {
  title: string;
  label: string;
  links: { label: string; href: string }[];
}) {
  return (
    <nav aria-label={label}>
      <h2 className="text-sm font-semibold tracking-wide text-accent">{title}</h2>
      <ul className="mt-4 flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={footerLinkStyles}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-[#103B34] text-[#D1E2DB]">
      <Container className="py-10 sm:py-12 lg:py-16">
        <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,0.7fr)_minmax(0,0.7fr)] lg:gap-12">
          <div className="max-w-sm">
            <Link
              href="/"
              aria-label="PickleCourt home"
              className="inline-flex items-center gap-2.5 rounded-lg text-xl font-extrabold tracking-tight text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg border border-white/20 bg-white">
                <Image src="/img/logo.png" alt="" width={40} height={40} className="size-full object-contain" />
              </span>
              PickleCourt
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-7 text-[#D1E2DB]">
              Your court. Your game. Discover great places to play and make every match count.
            </p>
          </div>

          <FooterLinkGroup title="Explore" label="Explore footer links" links={exploreLinks} />
          <FooterLinkGroup title="Account" label="Account footer links" links={accountLinks} />
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/15 pt-5 text-xs text-[#D1E2DB]/85 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:pt-6 sm:text-sm">
          <p><span>{"\u00A9"} {currentYear} PickleCourt. All rights reserved.</span></p>
          <p>Made for the love of the game.</p>
        </div>
      </Container>
    </footer>
  );
}
