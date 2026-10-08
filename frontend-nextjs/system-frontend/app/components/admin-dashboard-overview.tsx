"use client";

import { useSyncExternalStore } from "react";
import { courts } from "../data/courts";
import { createDemoBookings } from "../data/bookings";
import { formatPeso, getLocalDateString } from "../lib/booking-utils";
import RecentBookingsTable from "./recent-bookings-table";
import StatCard from "./stat-card";
import Button from "./button";

function subscribeToLocalDay(onChange: () => void) {
  let timer: ReturnType<typeof setTimeout>;

  function scheduleNextLocalDay() {
    const now = new Date();
    const nextDay = new Date(now);
    nextDay.setHours(24, 0, 0, 0);
    timer = setTimeout(() => {
      onChange();
      scheduleNextLocalDay();
    }, nextDay.getTime() - now.getTime() + 10);
  }

  scheduleNextLocalDay();
  return () => clearTimeout(timer);
}

export default function AdminDashboardOverview() {
  const localDay = useSyncExternalStore(subscribeToLocalDay, getLocalDateString, () => "");
  const demoBookings = localDay ? createDemoBookings(localDay) : [];
  const pendingBookings = demoBookings.filter((booking) => booking.status === "Pending").length;
  const estimatedRevenue = demoBookings
    .filter((booking) => booking.status !== "Cancelled")
    .reduce((total, booking) => total + booking.totalPrice, 0);
  const courtsById = new Map(courts.map((court) => [court.id, court]));
  const recentBookings = [...demoBookings]
    .sort((first, second) =>
      second.bookingDate.localeCompare(first.bookingDate) || second.startTime.localeCompare(first.startTime),
    )
    .slice(0, 5);

  const stats = [
    { label: "Total Courts", value: localDay ? String(courts.length) : "—", detail: "Courts in the demo dataset", icon: "C" },
    { label: "Total Bookings", value: localDay ? String(demoBookings.length) : "—", detail: "All demo booking records", icon: "B" },
    { label: "Pending Bookings", value: localDay ? String(pendingBookings) : "—", detail: "Demo bookings awaiting confirmation", icon: "P" },
    { label: "Estimated Revenue", value: localDay ? formatPeso(estimatedRevenue) : "—", detail: "Pending + confirmed demo bookings", icon: "₱" },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium leading-6 text-amber-900" role="note">
        Demo Admin Dashboard — Authentication and access restrictions are not yet enabled.
      </div>

      <section aria-labelledby="dashboard-stats-title">
        <div className="mb-4">
          <h1 id="dashboard-stats-title" className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-muted">A snapshot of your court booking activity.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
        </div>
        <p className="mt-3 text-xs text-muted">All statistics and revenue estimates are calculated from demo data.</p>
      </section>

      <RecentBookingsTable bookings={recentBookings} courtsById={courtsById} />

      <section aria-labelledby="quick-actions-title" className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Shortcuts</p>
          <h2 id="quick-actions-title" className="mt-1 text-lg font-bold text-foreground">Quick Actions</h2>
          <p className="mt-1 text-sm text-muted">Open an admin section. Management pages are not available yet.</p>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button href="/admin/courts" variant="secondary">View Courts</Button>
          <Button href="/admin/bookings" variant="secondary">View Bookings</Button>
          <Button href="/admin/customers" variant="secondary">View Customers</Button>
        </div>
      </section>
    </div>
  );
}
