"use client";

import { Fragment, useMemo, useState, useSyncExternalStore } from "react";
import type { CustomerStatus, DemoCustomer } from "../data/customers";
import { createDemoCustomers } from "../data/customers";
import { createDemoBookings } from "../data/bookings";
import type { DemoBooking } from "../data/bookings";
import { courts } from "../data/courts";
import { formatBookingDate, formatPeso, formatTime, getLocalDateString } from "../lib/booking-utils";
import Button from "./button";

type StatusFilter = "All" | CustomerStatus;

const fieldStyles =
  "mt-1.5 min-h-11 w-full rounded-xl border border-border bg-white px-3.5 text-sm text-foreground outline-none transition hover:border-primary/30 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20";

const statusStyles = {
  Active: "border-green-200 bg-green-50 text-green-800",
  Inactive: "border-gray-200 bg-gray-100 text-gray-700",
} as const;

function subscribeToLocalDay(onChange: () => void) {
  let timer: ReturnType<typeof setTimeout>;

  function scheduleNextDay() {
    const now = new Date();
    const nextDay = new Date(now);
    nextDay.setHours(24, 0, 0, 0);
    timer = setTimeout(() => {
      onChange();
      scheduleNextDay();
    }, nextDay.getTime() - now.getTime() + 10);
  }

  scheduleNextDay();
  return () => clearTimeout(timer);
}

function CustomerBookingHistory({ bookings }: { bookings: DemoBooking[] }) {
  const courtsById = useMemo(() => new Map(courts.map((court) => [court.id, court])), []);

  if (bookings.length === 0) {
    return <p className="mt-4 text-sm text-muted">No associated demo bookings are available.</p>;
  }

  return (
    <ul className="mt-4 grid gap-3 md:grid-cols-2">
      {bookings.map((booking) => {
        const court = courtsById.get(booking.courtId);
        return (
          <li key={booking.id} className="rounded-xl border border-border bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="font-semibold text-foreground">{booking.reference}</p>
              <span className="text-xs font-semibold text-primary">{formatPeso(booking.totalPrice)}</span>
            </div>
            <p className="mt-1 text-sm text-muted">{court?.name ?? "Court unavailable"}</p>
            <p className="mt-2 text-xs leading-5 text-muted">
              {formatBookingDate(booking.bookingDate)} · {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
            </p>
            <span className={`mt-3 inline-flex min-h-6 items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${booking.status === "Cancelled" ? "border-gray-200 bg-gray-100 text-gray-700" : booking.status === "Pending" ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800"}`}>
              {booking.status}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export default function AdminCustomerManagement() {
  const localDay = useSyncExternalStore(subscribeToLocalDay, getLocalDateString, () => "");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [expandedCustomerId, setExpandedCustomerId] = useState<string | null>(null);

  const customers = useMemo(() => localDay ? createDemoCustomers(localDay) : [], [localDay]);
  const bookings = useMemo(() => localDay ? createDemoBookings(localDay) : [], [localDay]);
  const bookingsByCustomer = useMemo(() => {
    const grouped = new Map<string, DemoBooking[]>();
    for (const booking of bookings) {
      if (!booking.customerId) continue;
      const customerBookings = grouped.get(booking.customerId) ?? [];
      customerBookings.push(booking);
      grouped.set(booking.customerId, customerBookings);
    }
    return grouped;
  }, [bookings]);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return customers.filter((customer) => {
      const matchesSearch = !query || customer.fullName.toLocaleLowerCase().includes(query) || customer.email.toLocaleLowerCase().includes(query);
      const matchesStatus = statusFilter === "All" || customer.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [customers, search, statusFilter]);

  function resetFilters() {
    setSearch("");
    setStatusFilter("All");
  }

  if (!localDay) {
    return <div aria-label="Loading demo customers" className="mt-6 h-48 animate-pulse rounded-2xl bg-white" />;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium leading-6 text-amber-900" role="note">
        Demo Customer Management — Customer information is fictional and not connected to real user accounts.
      </div>

      <section aria-label="Search and filter customers" className="grid gap-4 rounded-2xl border border-border bg-white p-4 shadow-sm sm:grid-cols-2 sm:p-5">
        <div>
          <label htmlFor="admin-customer-search" className="text-sm font-semibold text-foreground">Search customers</label>
          <input
            id="admin-customer-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Name or email"
            className={fieldStyles}
          />
        </div>
        <div>
          <label htmlFor="admin-customer-status" className="text-sm font-semibold text-foreground">Account status</label>
          <select id="admin-customer-status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)} className={fieldStyles}>
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </section>

      <section aria-label="Customer records" className="min-w-0 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-5">
          <p aria-live="polite" className="text-sm font-medium text-muted">{filteredCustomers.length} {filteredCustomers.length === 1 ? "customer" : "customers"}</p>
          {(search || statusFilter !== "All") && (
            <button type="button" onClick={resetFilters} className="min-h-9 rounded-lg px-3 text-sm font-semibold text-primary hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              Reset Filters
            </button>
          )}
        </div>

        {filteredCustomers.length > 0 ? (
          <div className="max-w-full overflow-x-auto">
            <table className="w-full min-w-[54rem] border-collapse text-left text-sm">
              <caption className="sr-only">Fictional demo customer records and their booking counts</caption>
              <thead className="bg-[#f7f9f6] text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">Customer Name</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Email</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Date Joined</th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">Total Bookings</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Account Status</th>
                  <th scope="col" className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCustomers.map((customer: DemoCustomer) => {
                  const customerBookings = bookingsByCustomer.get(customer.id) ?? [];
                  const expanded = expandedCustomerId === customer.id;
                  return (
                    <Fragment key={customer.id}>
                      <tr className="align-middle text-foreground">
                        <td className="whitespace-nowrap px-5 py-4 font-semibold">{customer.fullName}</td>
                        <td className="whitespace-nowrap px-4 py-4 text-muted">{customer.email}</td>
                        <td className="whitespace-nowrap px-4 py-4">{formatBookingDate(customer.createdAt)}</td>
                        <td className="whitespace-nowrap px-4 py-4 text-right font-medium">{customerBookings.length}</td>
                        <td className="whitespace-nowrap px-4 py-4">
                          <span className={`inline-flex min-h-7 items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[customer.status]}`}>
                            {customer.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-right">
                          <button
                            type="button"
                            aria-expanded={expanded}
                            aria-controls={`customer-details-${customer.id}`}
                            onClick={() => setExpandedCustomerId(expanded ? null : customer.id)}
                            className="min-h-10 rounded-lg px-3 text-xs font-semibold text-primary hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                          >
                            {expanded ? "Hide Details" : "View Details"}
                          </button>
                        </td>
                      </tr>
                      {expanded && (
                        <tr id={`customer-details-${customer.id}`}>
                          <td colSpan={6} className="bg-[#f7f9f6] px-4 py-4 sm:px-6">
                            <section aria-label={`Details for ${customer.fullName}`} className="rounded-xl border border-border bg-white p-4 sm:p-5">
                              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div><p className="text-xs font-semibold uppercase tracking-wide text-muted">Customer</p><p className="mt-1 font-semibold text-foreground">{customer.fullName}</p></div>
                                <div><p className="text-xs font-semibold uppercase tracking-wide text-muted">Demo email</p><p className="mt-1 break-all font-medium text-foreground">{customer.email}</p></div>
                                <div><p className="text-xs font-semibold uppercase tracking-wide text-muted">Account created</p><p className="mt-1 font-medium text-foreground">{formatBookingDate(customer.createdAt)}</p></div>
                                <div><p className="text-xs font-semibold uppercase tracking-wide text-muted">Status and bookings</p><p className="mt-1 font-medium text-foreground">{customer.status} · {customerBookings.length} {customerBookings.length === 1 ? "booking" : "bookings"}</p></div>
                              </div>
                              <div className="mt-5 border-t border-border pt-4">
                                <h3 className="font-semibold text-foreground">Associated demo booking history</h3>
                                <CustomerBookingHistory bookings={customerBookings} />
                              </div>
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
            <h2 className="text-lg font-bold text-foreground">No customers found</h2>
            <p className="mt-2 text-sm text-muted">Try adjusting your search or filter.</p>
            <Button type="button" variant="secondary" onClick={resetFilters} className="mt-4">Reset Filters</Button>
          </div>
        )}
      </section>
    </div>
  );
}
