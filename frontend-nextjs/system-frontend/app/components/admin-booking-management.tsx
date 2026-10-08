"use client";

import { Fragment, useMemo, useState, useSyncExternalStore } from "react";
import type { BookingStatus, DemoBooking } from "../data/bookings";
import { createDemoBookings } from "../data/bookings";
import { createDemoCustomers } from "../data/customers";
import { courts } from "../data/courts";
import { formatBookingDate, formatPeso, formatTime, getLocalDateString, parseLocalDate, timeToMinutes } from "../lib/booking-utils";
import Button from "./button";

type StatusFilter = "All" | BookingStatus;
type DateFilter = "All" | "Upcoming" | "Past";

const fieldStyles =
  "mt-1.5 min-h-11 w-full rounded-xl border border-border bg-white px-3.5 text-sm text-foreground outline-none transition hover:border-primary/30 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20";

const statusStyles = {
  Pending: "border-amber-200 bg-amber-50 text-amber-800",
  Confirmed: "border-green-200 bg-green-50 text-green-800",
  Cancelled: "border-gray-200 bg-gray-100 text-gray-700",
} as const;

function localClockSnapshot() {
  const now = new Date();
  return `${getLocalDateString(now)}T${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
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

function bookingEnd(booking: DemoBooking): Date | null {
  const date = parseLocalDate(booking.bookingDate);
  if (!date) return null;
  const [hour, minute] = booking.endTime.split(":").map(Number);
  date.setHours(hour, minute, 0, 0);
  return date;
}

function isUpcoming(booking: DemoBooking, now: Date): boolean {
  const end = bookingEnd(booking);
  return Boolean(end && end.getTime() > now.getTime());
}

function canChangeTo(current: BookingStatus, next: BookingStatus): boolean {
  if (current === "Pending") return next === "Confirmed" || next === "Cancelled";
  if (current === "Confirmed") return next === "Cancelled";
  return false;
}

export default function AdminBookingManagement() {
  const clock = useSyncExternalStore(subscribeToLocalMinute, localClockSnapshot, () => "");
  const now = parseLocalClock(clock);
  const localDate = clock.slice(0, 10);
  const demoCustomers = useMemo(() => localDate ? createDemoCustomers(localDate) : [], [localDate]);
  const customersById = useMemo(() => new Map(demoCustomers.map((customer) => [customer.id, customer])), [demoCustomers]);
  const [statusOverrides, setStatusOverrides] = useState<Record<string, BookingStatus>>({});
  const [selectedActions, setSelectedActions] = useState<Record<string, BookingStatus | "">>({});
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [dateFilter, setDateFilter] = useState<DateFilter>("All");
  const [search, setSearch] = useState("");
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const [demoMessage, setDemoMessage] = useState("");

  const courtsById = useMemo(() => new Map(courts.map((court) => [court.id, court])), []);
  const bookings = useMemo(() => {
    if (!localDate) return [];
    return createDemoBookings(localDate).map((booking) => ({
      ...booking,
      status: statusOverrides[booking.id] ?? booking.status,
    }));
  }, [localDate, statusOverrides]);

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return bookings.filter((booking) => {
      const courtName = courtsById.get(booking.courtId)?.name ?? "";
      const matchesSearch = !query || booking.reference.toLocaleLowerCase().includes(query) || courtName.toLocaleLowerCase().includes(query);
      const matchesStatus = statusFilter === "All" || booking.status === statusFilter;
      const matchesDate = dateFilter === "All" || (now && (isUpcoming(booking, now) ? "Upcoming" : "Past") === dateFilter);
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [bookings, courtsById, dateFilter, now, search, statusFilter]);

  if (!clock) {
    return <div aria-label="Loading demo bookings" className="mt-6 h-48 animate-pulse rounded-2xl bg-white" />;
  }

  function resetFilters() {
    setSearch("");
    setStatusFilter("All");
    setDateFilter("All");
  }

  function applyStatusChange(booking: DemoBooking) {
    const nextStatus = selectedActions[booking.id];
    if (!nextStatus || !canChangeTo(booking.status, nextStatus)) return;

    if (nextStatus === "Cancelled") {
      const confirmed = window.confirm(
        `Demo-only cancellation: change ${booking.reference} to Cancelled in temporary page state? No real reservation will be changed.`,
      );
      if (!confirmed) return;
    }

    setStatusOverrides((current) => ({ ...current, [booking.id]: nextStatus }));
    setSelectedActions((current) => ({ ...current, [booking.id]: "" }));
    setDemoMessage(`Demo action: ${booking.reference} status changed to ${nextStatus}. This change is temporary and no real reservation was updated.`);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium leading-6 text-amber-900" role="note">
        Demo Booking Management — Status changes are temporary and will reset when the page reloads.
      </div>

      {demoMessage && <p role="status" aria-live="polite" className="rounded-xl border border-primary/20 bg-[#f1f7e9] px-4 py-3 text-sm font-medium text-primary">{demoMessage}</p>}

      <section aria-label="Search and filter bookings" className="grid gap-4 rounded-2xl border border-border bg-white p-4 shadow-sm sm:grid-cols-2 xl:grid-cols-[minmax(15rem,1.5fr)_repeat(2,minmax(0,1fr))] sm:p-5">
        <div>
          <label htmlFor="admin-booking-search" className="text-sm font-semibold text-foreground">Search</label>
          <input
            id="admin-booking-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Reference or court name"
            className={fieldStyles}
          />
        </div>
        <div>
          <label htmlFor="admin-booking-status" className="text-sm font-semibold text-foreground">Status</label>
          <select id="admin-booking-status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)} className={fieldStyles}>
            <option>All</option>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Cancelled</option>
          </select>
        </div>
        <div>
          <label htmlFor="admin-booking-date" className="text-sm font-semibold text-foreground">Booking date</label>
          <select id="admin-booking-date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value as DateFilter)} className={fieldStyles}>
            <option>All</option>
            <option>Upcoming</option>
            <option>Past</option>
          </select>
        </div>
      </section>

      <section aria-label="Booking records" className="min-w-0 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-5">
          <p aria-live="polite" className="text-sm font-medium text-muted">{filteredBookings.length} {filteredBookings.length === 1 ? "booking" : "bookings"}</p>
          {(search || statusFilter !== "All" || dateFilter !== "All") && (
            <button type="button" onClick={resetFilters} className="min-h-9 rounded-lg px-3 text-sm font-semibold text-primary hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              Reset Filters
            </button>
          )}
        </div>

        {filteredBookings.length > 0 ? (
          <div className="max-w-full overflow-x-auto">
            <table className="w-full min-w-[76rem] border-collapse text-left text-sm">
              <caption className="sr-only">Demo bookings with court, schedule, amount, status, and management actions</caption>
              <thead className="bg-[#f7f9f6] text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Booking Reference</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Court Name</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Booking Date</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Start Time</th>
                  <th scope="col" className="px-4 py-3 font-semibold">End Time</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Customer</th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">Total Amount</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredBookings.map((booking) => {
                  const court = courtsById.get(booking.courtId);
                  if (!court) return null;
                  const customerName = booking.customerId
                    ? customersById.get(booking.customerId)?.fullName ?? "Demo Customer"
                    : "Demo Customer";
                  const expanded = expandedBooking === booking.id;
                  const actionValue = selectedActions[booking.id] ?? "";
                  const canManage = booking.status !== "Cancelled";
                  const duration = (timeToMinutes(booking.endTime) - timeToMinutes(booking.startTime)) / 60;

                  return (
                    <Fragment key={booking.id}>
                      <tr className="align-middle text-foreground">
                        <td className="whitespace-nowrap px-4 py-4 font-semibold text-primary">{booking.reference}</td>
                        <td className="whitespace-nowrap px-4 py-4">{court.name}</td>
                        <td className="whitespace-nowrap px-4 py-4">{formatBookingDate(booking.bookingDate)}</td>
                        <td className="whitespace-nowrap px-4 py-4">{formatTime(booking.startTime)}</td>
                        <td className="whitespace-nowrap px-4 py-4">{formatTime(booking.endTime)}</td>
                        <td className="whitespace-nowrap px-4 py-4">{customerName}</td>
                        <td className="whitespace-nowrap px-4 py-4 text-right font-medium">{formatPeso(booking.totalPrice)}</td>
                        <td className="whitespace-nowrap px-4 py-4">
                          <span className={`inline-flex min-h-7 items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[booking.status]}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex min-w-52 flex-col gap-2">
                            <button
                              type="button"
                              aria-expanded={expanded}
                              aria-controls={`booking-details-${booking.id}`}
                              onClick={() => setExpandedBooking(expanded ? null : booking.id)}
                              className="min-h-9 self-start rounded-lg px-2.5 text-xs font-semibold text-primary hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
                            >
                              {expanded ? "Hide Details" : "View Details"}
                            </button>
                            {canManage ? (
                              <div className="flex items-center gap-2">
                                <label htmlFor={`status-action-${booking.id}`} className="sr-only">New status for {booking.reference}</label>
                                <select
                                  id={`status-action-${booking.id}`}
                                  value={actionValue}
                                  onChange={(event) => setSelectedActions((current) => ({ ...current, [booking.id]: event.target.value as BookingStatus | "" }))}
                                  className="min-h-9 min-w-28 rounded-lg border border-border bg-white px-2 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                                >
                                  <option value="">Change status</option>
                                  {booking.status === "Pending" && <option value="Confirmed">Confirm</option>}
                                  <option value="Cancelled">Cancel</option>
                                </select>
                                <button
                                  type="button"
                                  disabled={!actionValue}
                                  onClick={() => applyStatusChange(booking)}
                                  className="min-h-9 rounded-lg bg-primary px-2.5 text-xs font-semibold text-white hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  Apply
                                </button>
                              </div>
                            ) : (
                              <span className="px-2.5 text-xs text-muted">No status changes available</span>
                            )}
                          </div>
                        </td>
                      </tr>
                      {expanded && (
                        <tr id={`booking-details-${booking.id}`}>
                          <td colSpan={9} className="bg-[#f7f9f6] px-4 py-4 sm:px-6">
                            <section aria-label={`Details for ${booking.reference}`} className="grid gap-4 rounded-xl border border-border bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
                              <div><p className="text-xs font-semibold uppercase tracking-wide text-muted">Booking reference</p><p className="mt-1 font-semibold text-foreground">{booking.reference}</p></div>
                              <div><p className="text-xs font-semibold uppercase tracking-wide text-muted">Court</p><p className="mt-1 font-semibold text-foreground">{court.name}</p><p className="text-sm text-muted">{court.location}</p></div>
                              <div><p className="text-xs font-semibold uppercase tracking-wide text-muted">Schedule</p><p className="mt-1 font-semibold text-foreground">{formatBookingDate(booking.bookingDate)}</p><p className="text-sm text-muted">{formatTime(booking.startTime)} - {formatTime(booking.endTime)} ({duration} {duration === 1 ? "hour" : "hours"})</p></div>
                              <div><p className="text-xs font-semibold uppercase tracking-wide text-muted">Customer and total</p><p className="mt-1 font-semibold text-foreground">{customerName}</p><p className="text-sm text-muted">{formatPeso(booking.totalPrice)}</p></div>
                              <div className="sm:col-span-2 lg:col-span-4"><p className="text-xs font-semibold uppercase tracking-wide text-muted">Status</p><p className="mt-1 font-semibold text-foreground">{booking.status}</p></div>
                            </section>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-5 py-12 text-center">
            <h2 className="text-lg font-bold text-foreground">No bookings found</h2>
            <p className="mt-2 text-sm text-muted">Try adjusting your search or filters.</p>
            <Button type="button" variant="secondary" onClick={resetFilters} className="mt-4">Reset Filters</Button>
          </div>
        )}
      </section>
    </div>
  );
}
