import type { Court } from "../data/courts";
import type { DemoBooking } from "../data/bookings";
import { formatBookingDate, formatPeso, formatTime } from "../lib/booking-utils";

type RecentBookingsTableProps = {
  bookings: DemoBooking[];
  courtsById: Map<string, Court>;
};

const statusStyles = {
  Pending: "border-amber-200 bg-amber-50 text-amber-800",
  Confirmed: "border-green-200 bg-green-50 text-green-800",
  Cancelled: "border-gray-200 bg-gray-100 text-gray-700",
} as const;

export default function RecentBookingsTable({ bookings, courtsById }: RecentBookingsTableProps) {
  return (
    <section aria-labelledby="recent-bookings-title" className="min-w-0 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border px-5 py-5 sm:px-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Latest activity</p>
          <h2 id="recent-bookings-title" className="mt-1 text-lg font-bold text-foreground">Recent Bookings</h2>
        </div>
        <span className="rounded-full bg-background px-3 py-1 text-xs font-medium text-muted">Demo data</span>
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full min-w-[52rem] border-collapse text-left text-sm">
          <caption className="sr-only">The five most recent demo bookings, sorted newest first</caption>
          <thead className="bg-[#f7f9f6] text-xs uppercase tracking-wide text-muted">
            <tr>
              <th scope="col" className="px-5 py-3 font-semibold sm:px-6">Booking Reference</th>
              <th scope="col" className="px-4 py-3 font-semibold">Court</th>
              <th scope="col" className="px-4 py-3 font-semibold">Date</th>
              <th scope="col" className="px-4 py-3 font-semibold">Time</th>
              <th scope="col" className="px-4 py-3 font-semibold">Status</th>
              <th scope="col" className="px-5 py-3 text-right font-semibold sm:px-6">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {bookings.map((booking) => (
              <tr key={booking.id} className="align-middle text-foreground">
                <td className="whitespace-nowrap px-5 py-4 font-semibold text-primary sm:px-6">{booking.reference}</td>
                <td className="whitespace-nowrap px-4 py-4">{courtsById.get(booking.courtId)?.name ?? "Unknown court"}</td>
                <td className="whitespace-nowrap px-4 py-4">{formatBookingDate(booking.bookingDate)}</td>
                <td className="whitespace-nowrap px-4 py-4">{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</td>
                <td className="whitespace-nowrap px-4 py-4">
                  <span className={`inline-flex min-h-7 items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[booking.status]}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-right font-semibold sm:px-6">{formatPeso(booking.totalPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
