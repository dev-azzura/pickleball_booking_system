import { courts } from "./courts";

export type BookingStatus = "Pending" | "Confirmed" | "Cancelled";

export type DemoBooking = {
  id: string;
  reference: string;
  courtId: string;
  customerId?: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: BookingStatus;
};

type BookingSeed = Omit<DemoBooking, "bookingDate" | "totalPrice"> & {
  daysFromToday: number;
};

const bookingSeeds: BookingSeed[] = [
  { id: "demo-booking-001", reference: "DEMO-1001", courtId: "indoor-premium", customerId: "demo-customer-001", daysFromToday: 1, startTime: "10:00", endTime: "12:00", status: "Confirmed" },
  { id: "demo-booking-002", reference: "DEMO-1002", courtId: "outdoor-standard", customerId: "demo-customer-002", daysFromToday: 3, startTime: "14:00", endTime: "16:00", status: "Pending" },
  { id: "demo-booking-003", reference: "DEMO-1003", courtId: "championship", customerId: "demo-customer-001", daysFromToday: 7, startTime: "08:00", endTime: "10:00", status: "Confirmed" },
  { id: "demo-booking-004", reference: "DEMO-1004", courtId: "garden-court", customerId: "demo-customer-003", daysFromToday: -2, startTime: "17:00", endTime: "19:00", status: "Confirmed" },
  { id: "demo-booking-005", reference: "DEMO-1005", courtId: "clubhouse-court", customerId: "demo-customer-004", daysFromToday: 5, startTime: "09:00", endTime: "10:00", status: "Cancelled" },
  { id: "demo-booking-006", reference: "DEMO-1006", courtId: "sunset-court", customerId: "demo-customer-003", daysFromToday: -4, startTime: "15:00", endTime: "17:00", status: "Cancelled" },
];

const hourlyRateByCourtId = new Map(courts.map((court) => [court.id, court.pricePerHour]));

export function createDemoBookings(localDate: string): DemoBooking[] {
  const [year, month, day] = localDate.split("-").map(Number);
  const baseDate = new Date(year, month - 1, day);

  return bookingSeeds.map((seed) => {
    const bookingDate = new Date(baseDate);
    bookingDate.setDate(bookingDate.getDate() + seed.daysFromToday);
    const [startHour, startMinute] = seed.startTime.split(":").map(Number);
    const [endHour, endMinute] = seed.endTime.split(":").map(Number);
    const duration = (endHour * 60 + endMinute - startHour * 60 - startMinute) / 60;

    return {
      id: seed.id,
      reference: seed.reference,
      courtId: seed.courtId,
      customerId: seed.customerId,
      bookingDate: `${bookingDate.getFullYear()}-${(bookingDate.getMonth() + 1).toString().padStart(2, "0")}-${bookingDate.getDate().toString().padStart(2, "0")}`,
      startTime: seed.startTime,
      endTime: seed.endTime,
      totalPrice: duration * (hourlyRateByCourtId.get(seed.courtId) ?? 0),
      status: seed.status,
    };
  });
}
