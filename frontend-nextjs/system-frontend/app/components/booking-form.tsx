"use client";

import { useMemo, useState, useSyncExternalStore, type FormEvent } from "react";
import type { Court } from "../data/courts";
import { formatBookingDate, formatPeso, formatTime, getLocalDateString, minutesToTime, parseLocalDate, timeToMinutes } from "../lib/booking-utils";
import BookingSummary from "./booking-summary";
import Button from "./button";

const controlStyles =
  "min-h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-foreground outline-none transition-colors hover:border-primary/30 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-muted";

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

function getServerLocalDay() {
  return "";
}

export default function BookingForm({ court }: { court: Court }) {
  const today = useSyncExternalStore(subscribeToLocalDay, getLocalDateString, getServerLocalDay);
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [confirmation, setConfirmation] = useState("");

  const openingMinutes = timeToMinutes(court.openingTime);
  const closingMinutes = timeToMinutes(court.closingTime);
  const startSlots = useMemo(() => {
    const slots: string[] = [];
    for (let time = openingMinutes; time + 60 <= closingMinutes; time += 60) {
      slots.push(minutesToTime(time));
    }
    return slots;
  }, [closingMinutes, openingMinutes]);

  const selectedLocalDate = parseLocalDate(selectedDate);
  const dateIssue = (() => {
    if (!selectedDate) return "Select a booking date.";
    if (!selectedLocalDate) return "Enter a valid booking date.";
    if (today && selectedDate < today) return "The booking date cannot be in the past.";
    if (court.operatingDays && !court.operatingDays.includes(selectedLocalDate.getDay())) {
      return "This court is not open on the selected day.";
    }
    return "";
  })();

  const endTimes = useMemo(() => {
    if (!startTime || !startSlots.includes(startTime)) return [];
    const options: string[] = [];
    for (let time = timeToMinutes(startTime) + 60; time <= closingMinutes; time += 60) {
      options.push(minutesToTime(time));
    }
    return options;
  }, [closingMinutes, startSlots, startTime]);

  const startIssue = !dateIssue && !startTime
    ? "Choose a start time."
    : startTime && !startSlots.includes(startTime)
      ? "Choose a start time within the court operating hours."
      : "";
  const endIssue = !dateIssue && !startIssue && !endTime
    ? "Choose an end time."
    : endTime && startTime && timeToMinutes(endTime) <= timeToMinutes(startTime)
      ? "The end time must be later than the start time."
      : endTime && !endTimes.includes(endTime)
        ? "Choose an end time within the court operating hours."
        : "";

  function clearConfirmation() {
    setConfirmation("");
  }

  function handleDateChange(value: string) {
    setSelectedDate(value);
    setStartTime("");
    setEndTime("");
    clearConfirmation();
  }

  function handleStartTimeChange(value: string) {
    setStartTime(value);
    setEndTime(value ? minutesToTime(timeToMinutes(value) + 60) : "");
    clearConfirmation();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttemptedSubmit(true);
    if (dateIssue || startIssue || endIssue) return;

    const hours = (timeToMinutes(endTime) - timeToMinutes(startTime)) / 60;
    const total = hours * court.pricePerHour;
    setConfirmation(
      `${court.name} — ${formatBookingDate(selectedDate)}, ${formatTime(startTime)} to ${formatTime(endTime)}. Estimated total: ${formatPeso(total)}. Preview only; no real reservation was created.`,
    );
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(19rem,0.95fr)] lg:gap-8">
      <form noValidate onSubmit={handleSubmit} className="min-w-0 rounded-2xl border border-border bg-white p-5 shadow-soft sm:rounded-3xl sm:p-7 lg:p-8">
        <div className="border-b border-border pb-5 sm:pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Plan your next game</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Choose your schedule</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Booking for <span className="font-semibold text-foreground">{court.name}</span> in {court.location}.
          </p>
        </div>

        <section aria-labelledby="booking-date-heading" className="mt-6 sm:mt-7">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">01 <span aria-hidden="true" className="mx-1 text-[#5C9142]">—</span> Select Your Date</p>
          <h3 id="booking-date-heading" className="sr-only">Select your booking date</h3>
          <div className="mt-4">
            <label htmlFor="booking-date" className="text-sm font-semibold text-foreground">
              Booking date <span aria-hidden="true" className="text-red-700">*</span>
            </label>
            <div className="relative mt-2">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted">
                <rect x="3.5" y="5" width="17" height="15" rx="2" />
                <path d="M7.5 3v4M16.5 3v4M3.5 9.5h17M8 13h.01M12 13h.01M16 13h.01M8 16.5h.01M12 16.5h.01" />
              </svg>
              <input
                id="booking-date"
                type="date"
                value={selectedDate}
                min={today || undefined}
                required
                aria-required="true"
                aria-invalid={attemptedSubmit && Boolean(dateIssue)}
                aria-describedby={attemptedSubmit && dateIssue ? "booking-date-error" : "booking-date-help"}
                onChange={(event) => handleDateChange(event.target.value)}
                className={`${controlStyles} pl-12`}
              />
            </div>
            <p id={attemptedSubmit && dateIssue ? "booking-date-error" : "booking-date-help"} className={`mt-2 text-xs leading-5 ${attemptedSubmit && dateIssue ? "text-red-700" : "text-muted"}`}>
              {attemptedSubmit && dateIssue ? dateIssue : "Choose a date from today onward. Dates use your local calendar."}
            </p>
          </div>
        </section>

        <fieldset className="mt-7 border-t border-border pt-6 sm:mt-8 sm:pt-7" aria-describedby="time-slot-help">
          <legend className="sr-only">Select your booking time</legend>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">02 <span aria-hidden="true" className="mx-1 text-[#5C9142]">—</span> Select Your Time</p>
          <p id="time-slot-help" className="mt-2 text-sm leading-6 text-muted">Start times follow this court&apos;s operating hours. All displayed times are sample options, not live availability.</p>

          <div className="mt-4">
            <p className="text-sm font-semibold text-foreground">Start time <span aria-hidden="true" className="text-red-700">*</span></p>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
              {startSlots.map((slot) => {
                const isSelected = startTime === slot;
                const slotEnd = minutesToTime(timeToMinutes(slot) + 60);
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={!selectedDate || Boolean(dateIssue)}
                    aria-pressed={isSelected}
                    onClick={() => handleStartTimeChange(slot)}
                    className={`min-h-12 rounded-xl border px-2 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-45 sm:text-sm ${isSelected ? "border-primary bg-primary text-white shadow-sm" : "border-border bg-white text-foreground hover:border-primary/50 hover:bg-primary/5"}`}
                  >
                    {formatTime(slot)} <span aria-hidden="true">–</span> {formatTime(slotEnd)}
                  </button>
                );
              })}
            </div>
            {attemptedSubmit && startIssue && <p role="alert" className="mt-2 text-xs text-red-700">{startIssue}</p>}
            {!selectedDate && <p className="mt-2 text-xs text-muted">Select a date to enable the sample start times.</p>}
            {selectedDate && dateIssue && <p className="mt-2 text-xs text-amber-800">{dateIssue}</p>}
          </div>

          <div className="mt-5">
            <label htmlFor="booking-end-time" className="text-sm font-semibold text-foreground">
              End time <span aria-hidden="true" className="text-red-700">*</span>
            </label>
            <select
              id="booking-end-time"
              value={endTime}
              required
              aria-required="true"
              disabled={!startTime || Boolean(dateIssue)}
              aria-invalid={attemptedSubmit && Boolean(endIssue)}
              aria-describedby={attemptedSubmit && endIssue ? "booking-end-error" : "booking-end-help"}
              onChange={(event) => { setEndTime(event.target.value); clearConfirmation(); }}
              className={`${controlStyles} mt-2`}
            >
              <option value="">Select an end time</option>
              {endTimes.map((time) => <option key={time} value={time}>{formatTime(time)}</option>)}
            </select>
            <p id={attemptedSubmit && endIssue ? "booking-end-error" : "booking-end-help"} className={`mt-2 text-xs leading-5 ${attemptedSubmit && endIssue ? "text-red-700" : "text-muted"}`}>
              {attemptedSubmit && endIssue ? endIssue : "Choose an end time at least one hour after your start."}
            </p>
          </div>
        </fieldset>

        <Button type="submit" className="mt-7 min-h-12 w-full rounded-xl text-base font-bold sm:mt-8">
          Preview Booking
        </Button>
        <p className="mt-3 text-center text-xs leading-5 text-muted">Demo only. No reservation is saved and sample times are not verified in real time.</p>

        <div aria-live="polite" aria-atomic="true" className="mt-4">
          {confirmation && (
            <div role="status" className="rounded-xl border border-primary/20 bg-[#f1f7e9] p-4 text-sm leading-6 text-primary">
              <p className="font-bold">Booking preview</p>
              <p className="mt-1">{confirmation}</p>
            </div>
          )}
        </div>
      </form>

      <BookingSummary
        court={court}
        selectedDate={selectedDate}
        startTime={startTime}
        endTime={endTime}
      />
    </div>
  );
}
