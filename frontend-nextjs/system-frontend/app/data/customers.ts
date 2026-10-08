export type CustomerStatus = "Active" | "Inactive";

export type DemoCustomer = {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
  status: CustomerStatus;
};

type CustomerSeed = Omit<DemoCustomer, "createdAt"> & { daysAgo: number };

const customerSeeds: CustomerSeed[] = [
  { id: "demo-customer-001", fullName: "Avery Rally", email: "avery.rally@example.com", daysAgo: 180, status: "Active" },
  { id: "demo-customer-002", fullName: "Jordan Paddle", email: "jordan.paddle@example.com", daysAgo: 120, status: "Active" },
  { id: "demo-customer-003", fullName: "Casey Court", email: "casey.court@example.com", daysAgo: 90, status: "Active" },
  { id: "demo-customer-004", fullName: "Riley Volley", email: "riley.volley@example.com", daysAgo: 45, status: "Inactive" },
  { id: "demo-customer-005", fullName: "Morgan Dink", email: "morgan.dink@example.com", daysAgo: 20, status: "Active" },
  { id: "demo-customer-006", fullName: "Taylor Serve", email: "taylor.serve@example.com", daysAgo: 7, status: "Active" },
];

export function createDemoCustomers(localDate: string): DemoCustomer[] {
  const [year, month, day] = localDate.split("-").map(Number);
  const baseDate = new Date(year, month - 1, day);

  return customerSeeds.map((seed) => {
    const createdAt = new Date(baseDate);
    createdAt.setDate(createdAt.getDate() - seed.daysAgo);
    return {
      id: seed.id,
      fullName: seed.fullName,
      email: seed.email,
      createdAt: `${createdAt.getFullYear()}-${(createdAt.getMonth() + 1).toString().padStart(2, "0")}-${createdAt.getDate().toString().padStart(2, "0")}`,
      status: seed.status,
    };
  });
}
