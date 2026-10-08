"use client";

import { useState, useSyncExternalStore } from "react";
import type { Court } from "../data/courts";
import { createDemoBookings, type BookingStatus, type DemoBooking } from "../data/bookings";
import { getLocalDateString, parseLocalDate } from "../lib/booking-utils";
import BookingCard from "./booking-card";
import Button from "./button";

type StatusFilter = "all" | BookingStatus;
type DateFilter = "all" | "upcoming" | "past";

function getLocalClockSnapshot() {
  const now = new Date();
  const hour = now.getHours().toString().padStart(2, "0");
  const minute = now.getMinutes().toString().padStart(2, "0");
  return `${getLocalDateString(now)}T${hour}:${minute}`;
}

function subscribeToLocalMinute(onChange: () => void) {
  let timer: ReturnType<typeof setTimeout>;

  function scheduleNextMinute() {
    const now = new Date();
    const nextMinute = new Date(now);
    nextMinute.setSeconds(0, 0);
    nextMinute.setMinutes(nextMinute.getMinutes() + 1);
    timer = setTimeout(() => {
      onChange();
      scheduleNextMinute();
    }, nextMinute.getTime() - now.getTime() + 10);
  }

  scheduleNextMinute();
  return () => clearTimeout(timer);
}

function parseLocalClock(snapshot: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(snapshot);
  if (!match) return null;
  const [, year, month, day, hour, minute] = match;
  return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
}

function bookingHasEnded(booking: DemoBooking, now: Date): boolean {
  const date = parseLocalDate(booking.bookingDate);
  if (!date) return true;
  const [hour, minute] = booking.endTime.split(":").map(Number);
  date.setHours(hour, minute, 0, 0);
  return date.getTime() <= now.getTime();
}

const statusFilters: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All Bookings" },
  { id: "Pending", label: "Pending" },
  { id: "Confirmed", label: "Confirmed" },
  { id: "Cancelled", label: "Cancelled" },
];

const dateFilters: { id: DateFilter; label: string }[] = [
  { id: "all", label: "All dates" },
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past" },
];

function MetricIcon({ kind }: { kind: "all" | "upcoming" | "completed" }) {
  const shapes = {
    all: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4m8-4v4M4 9h16M8 13h3m-3 3h7" /></>,
    upcoming: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2M17 4l2 2" /></>,
    completed: <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16.5 9" /></>,
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-5">
      {shapes[kind]}
    </svg>
  );
}

export default function BookingList({ courts }: { courts: Court[] }) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const clockSnapshot = useSyncExternalStore(subscribeToLocalMinute, getLocalClockSnapshot, () => "");
  const now = parseLocalClock(clockSnapshot);
  const today = clockSnapshot.slice(0, 10);
  const bookings = today ? createDemoBookings(today) : [];
  const courtsById = new Map(courts.map((court) => [court.id, court]));

  function getDateCategory(booking: DemoBooking): "upcoming" | "past" | "cancelled" {
    if (booking.status === "Cancelled") return "cancelled";
    if (!now || !bookingHasEnded(booking, now)) return "upcoming";
    return "past";
  }

  const statusCounts: Record<StatusFilter, number> = {
    all: bookings.length,
    Pending: bookings.filter((booking) => booking.status === "Pending").length,
    Confirmed: bookings.filter((booking) => booking.status === "Confirmed").length,
    Cancelled: bookings.filter((booking) => booking.status === "Cancelled").length,
  };
  const upcomingCount = bookings.filter((booking) => getDateCategory(booking) === "upcoming").length;
  const completedCount = bookings.filter((booking) =>
    booking.status === "Confirmed" && now !== null && bookingHasEnded(booking, now),
  ).length;
  const dateCounts: Record<DateFilter, number> = {
    all: bookings.length,
    upcoming: upcomingCount,
    past: completedCount,
  };
  const visibleBookings = bookings.filter((booking) =>
    (statusFilter === "all" || booking.status === statusFilter) &&
    (dateFilter === "all" || getDateCategory(booking) === dateFilter),
  );
  const filtersAreActive = statusFilter !== "all" || dateFilter !== "all";

  function resetFilters() {
    setStatusFilter("all");
    setDateFilter("all");
  }

  if (!clockSnapshot) {
    return <div aria-label="Loading demo bookings" className="h-40 animate-pulse rounded-2xl bg-white" />;
  }

  const metrics = [
    { label: "Total Bookings", value: bookings.length, icon: "all" as const },
    { label: "Upcoming Bookings", value: upcomingCount, icon: "upcoming" as const },
    { label: "Completed Bookings", value: completedCount, icon: "completed" as const },
  ];

  return (
    <div className="space-y-7 sm:space-y-8">
      <p role="note" className="rounded-2xl border border-accent/60 bg-[#f3f8e9] px-4 py-3 text-sm leading-6 text-primary">
        Demo bookings are shown for preview purposes. Live booking history will be available after account integration.
      </p>

      <section aria-label="Booking summary" className="grid gap-4 sm:grid-cols-3 sm:gap-5">
        {metrics.map((metric) => (
          <article key={metric.label} className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-muted">{metric.label}</p>
              <span className="grid size-10 place-items-center rounded-xl bg-[#eff8dc] text-primary">
                <MetricIcon kind={metric.icon} />
              </span>
            </div>
            <p className="mt-4 text-3xl font-extrabold tracking-tight text-primary" aria-label={`${metric.value} ${metric.label.toLowerCase()}`}>
              {metric.value}
            </p>
          </article>
        ))}
      </section>

      <section aria-label="Booking filters" className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Filter by status</h2>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter bookings by status">
            {statusFilters.map((filter) => {
              const active = statusFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setStatusFilter(filter.id)}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${active ? "border-primary bg-primary text-white" : "border-border bg-[#f8faf7] text-foreground hover:border-primary/35 hover:bg-primary/5"}`}
                >
                  {filter.label}
                  <span className={`grid min-w-6 place-items-center rounded-full px-1.5 py-0.5 text-xs ${active ? "bg-white/15 text-white" : "bg-white text-muted"}`}>
                    {statusCounts[filter.id]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 border-t border-border pt-4">
          <h2 className="text-sm font-semibold text-foreground">Filter by date</h2>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter bookings by date">
            {dateFilters.map((filter) => {
              const active = dateFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setDateFilter(filter.id)}
                  className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${active ? "border-primary/20 bg-[#eff8dc] text-primary" : "border-border bg-white text-muted hover:border-primary/35 hover:text-primary"}`}
                >
                  {filter.label}
                  <span className="text-xs tabular-nums">{dateCounts[filter.id]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section aria-labelledby="booking-results-title">
        <div className="mb-4 flex flex-col gap-1 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="booking-results-title" className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Your Bookings</h2>
            <p aria-live="polite" className="mt-1 text-sm text-muted">
              Showing {visibleBookings.length} {visibleBookings.length === 1 ? "booking" : "bookings"}
            </p>
          </div>
          {filtersAreActive && (
            <button type="button" onClick={resetFilters} className="min-h-10 w-fit rounded-lg px-2 text-sm font-semibold text-primary hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              Reset filters
            </button>
          )}
        </div>

        {visibleBookings.length > 0 ? (
          <div className="space-y-4 sm:space-y-5">
            {visibleBookings.map((booking) => {
              const court = courtsById.get(booking.courtId);
              return court ? <BookingCard key={booking.id} booking={booking} court={court} /> : null;
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-primary/25 bg-white px-5 py-14 text-center sm:py-16">
            <span aria-hidden="true" className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#eff8dc] text-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-6">
                <rect x="3.5" y="5" width="17" height="15" rx="2" />
                <path d="M7.5 3v4M16.5 3v4M3.5 9.5h17M9 14h6" />
              </svg>
            </span>
            <h3 className="mt-4 text-xl font-bold text-foreground">No bookings found</h3>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted">
              {filtersAreActive ? "No bookings match your selected filters." : "Your bookings will appear here when they are available."}
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {filtersAreActive && (
                <Button type="button" variant="secondary" onClick={resetFilters} className="rounded-xl">
                  Reset Filters
                </Button>
              )}
              <Button href="/courts" className="rounded-xl">Explore Courts</Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
