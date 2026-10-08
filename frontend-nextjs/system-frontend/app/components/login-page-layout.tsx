import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import Container from "./container";

type AuthSplitLayoutProps = {
  children: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  brandLineOne: string;
  brandLineTwo: string;
  brandDescription: string;
  footer: ReactNode;
  demoNotice: string;
  panelColor?: string;
};

export default function AuthSplitLayout({
  children, eyebrow, title, description, brandLineOne, brandLineTwo,
  brandDescription, footer, demoNotice, panelColor = "#103B34",
}: AuthSplitLayoutProps) {
  return (
    <main className="flex flex-1 items-center py-8 sm:py-12">
      <Container className="max-w-6xl">
        <div className="grid overflow-hidden rounded-3xl border border-border bg-white shadow-soft lg:min-h-[650px] lg:grid-cols-2">
          <aside style={{ backgroundColor: panelColor }} className="relative hidden flex-col overflow-hidden p-8 text-white sm:p-10 lg:flex lg:p-12">
            <div aria-hidden="true" className="absolute -right-24 -top-24 size-72 rounded-full border-[42px] border-white/5" />
            <Link href="/" aria-label="PickleCourt home" className="relative z-10 inline-flex w-fit items-center gap-3 rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C5F277]">
              <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-white">
                <Image src="/img/logo.png" alt="" width={44} height={44} priority className="size-full object-contain" />
              </span>
              <span className="text-lg font-bold tracking-tight">PickleCourt</span>
            </Link>

            <div className="relative z-10 mt-12 xl:mt-16">
              <h2 className="text-4xl font-extrabold leading-[1.05] tracking-tight xl:text-5xl">
                <span className="block text-white">{brandLineOne}</span>
                <span className="mt-1 block text-[#C5F277]">{brandLineTwo}</span>
              </h2>
              <p className="mt-5 max-w-md text-base leading-7 text-[#D1E2DB]">
                {brandDescription}
              </p>
            </div>

            <div className="relative mt-9 min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/15 xl:mt-11">
              <Image
                src="/img/login-register.png"
                alt="Indoor pickleball court ready for a game"
                fill
                priority
                sizes="(min-width: 1280px) 560px, (min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#103B34]/45 via-transparent to-transparent" />
            </div>
          </aside>

          <section className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
            <div className="w-full max-w-md">
              <header>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#5C9142]">{eyebrow}</p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#164A41] sm:text-4xl">{title}</h1>
                <p className="mt-3 text-sm leading-6 text-[#64748B]">{description}</p>
              </header>
              <div className="mt-8">{children}</div>
              <p className="mt-5 rounded-xl border border-[#164A41]/10 bg-[#F8FAF7] px-4 py-3 text-xs leading-5 text-[#64748B]">
                {demoNotice}
              </p>
              <div className="mt-7 border-t border-border pt-5 text-center text-sm text-[#64748B]">{footer}</div>
            </div>
          </section>
        </div>
      </Container>
    </main>
  );
}
