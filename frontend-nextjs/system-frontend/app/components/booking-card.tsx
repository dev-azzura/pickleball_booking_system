"use client";

import Link from "next/link";
import { useState, type SyntheticEvent } from "react";
import type { Court } from "../data/courts";
import type { DemoBooking } from "../data/bookings";
import { formatBookingDate, formatPeso, formatTime, timeToMinutes } from "../lib/booking-utils";
import CourtImage from "./court-image";

type BookingCardProps = {
  booking: DemoBooking;
  court: Court;
};

const statusStyles = {
  Pending: "border-amber-200 bg-amber-50 text-amber-900",
  Confirmed: "border-green-200 bg-green-50 text-green-900",
  Cancelled: "border-red-200 bg-red-50 text-red-900",
} as const;

export default function BookingCard({ booking, court }: BookingCardProps) {
  const [expanded, setExpanded] = useState(false);
  const duration = (timeToMinutes(booking.endTime) - timeToMinutes(booking.startTime)) / 60;
  const detailsId = `booking-details-${booking.id}`;

  function syncExpandedState(event: SyntheticEvent<HTMLDetailsElement>) {
    setExpanded(event.currentTarget.open);
  }

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition duration-300 hover:border-primary/20 hover:shadow-soft motion-reduce:transition-none sm:rounded-3xl">
      <div className="grid sm:grid-cols-[13rem_minmax(0,1fr)] lg:grid-cols-[15rem_minmax(0,1fr)]">
        <CourtImage
          src={court.image}
          alt={`${court.category} pickleball court at ${court.name}`}
          variant={court.artwork}
          className="aspect-[1.9] w-full sm:aspect-auto sm:min-h-full"
        />
        <div className="min-w-0 p-4 sm:p-5 lg:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.13em] text-primary">{court.category} court</p>
              <h2 className="mt-1 break-words text-lg font-bold tracking-tight text-foreground sm:text-xl">{court.name}</h2>
              <p className="mt-1 break-all text-xs text-muted">Demo booking reference: {booking.reference}</p>
            </div>
            <span className={`inline-flex min-h-8 shrink-0 items-center rounded-full border px-3 py-1 text-xs font-bold ${statusStyles[booking.status]}`}>
              {booking.status}
            </span>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 text-sm sm:grid-cols-4">
            <div className="min-w-0">
              <dt className="text-xs text-muted">Date</dt>
              <dd className="mt-1 break-words font-medium leading-5 text-foreground">{formatBookingDate(booking.bookingDate)}</dd>
            </div>
            <div className="min-w-0">
              <dt className="text-xs text-muted">Time</dt>
              <dd className="mt-1 font-medium leading-5 text-foreground">{formatTime(booking.startTime)} – {formatTime(booking.endTime)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Duration</dt>
              <dd className="mt-1 font-medium leading-5 text-foreground">{duration} {duration === 1 ? "hour" : "hours"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Total</dt>
              <dd className="mt-1 font-bold leading-5 text-primary">{formatPeso(booking.totalPrice)}</dd>
            </div>
          </dl>

          <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-4">
            <Link
              href={`/courts/${court.id}`}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-[#103B34] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none"
            >
              View Court
            </Link>
            <details className="group/details min-w-0" onToggle={syncExpandedState}>
              <summary
                aria-expanded={expanded}
                aria-controls={detailsId}
                className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-xl px-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden motion-reduce:transition-none"
              >
                {expanded ? "Hide details" : "View details"}
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`size-4 transition-transform motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`}>
                  <path d="m7 10 5 5 5-5" />
                </svg>
              </summary>
              <div id={detailsId} className="mt-3 w-full rounded-2xl border border-border bg-[#f8faf7] p-4 sm:p-5">
                <h3 className="text-sm font-bold text-foreground">Booking details</h3>
                <dl className="mt-3 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-muted">Court</dt>
                    <dd className="mt-1 font-medium text-foreground">{court.name}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Booking date</dt>
                    <dd className="mt-1 font-medium text-foreground">{formatBookingDate(booking.bookingDate)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Time</dt>
                    <dd className="mt-1 font-medium text-foreground">{formatTime(booking.startTime)} – {formatTime(booking.endTime)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Duration</dt>
                    <dd className="mt-1 font-medium text-foreground">{duration} {duration === 1 ? "hour" : "hours"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Hourly rate</dt>
                    <dd className="mt-1 font-medium text-foreground">{formatPeso(court.pricePerHour)} / hour</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Total amount</dt>
                    <dd className="mt-1 font-semibold text-primary">{formatPeso(booking.totalPrice)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Status</dt>
                    <dd className="mt-1 font-medium text-foreground">{booking.status}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Location</dt>
                    <dd className="mt-1 font-medium text-foreground">{court.location}</dd>
                  </div>
                </dl>
                <p className="mt-4 border-t border-border pt-3 text-xs leading-5 text-muted">{court.description}</p>
                <ul aria-label="Court amenities" className="mt-3 flex flex-wrap gap-2">
                  {court.amenities.map((amenity) => (
                    <li key={amenity} className="rounded-full border border-border bg-white px-2.5 py-1 text-xs text-foreground">{amenity}</li>
                  ))}
                </ul>
              </div>
            </details>
          </div>
        </div>
      </div>
    </article>
  );
}
