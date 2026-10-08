"use client";

import { useState, type ReactNode } from "react";
import AdminHeader from "./admin-header";
import AdminSidebar from "./admin-sidebar";

export default function AdminShell({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f1f4f1]">
      <AdminSidebar mobileOpen={mobileMenuOpen} onNavigate={() => setMobileMenuOpen(false)} />
      <div className="min-h-screen md:pl-64">
        <AdminHeader onMenuClick={() => setMobileMenuOpen((open) => !open)} />
        <main id="admin-main" className="mx-auto w-full max-w-screen-2xl p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
