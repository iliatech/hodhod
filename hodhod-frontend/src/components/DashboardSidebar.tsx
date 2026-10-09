"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Tab {
  id: string;
  label: string;
  number: number;
  href: string;
}

const tabs: Tab[] = [
  { id: "interview", label: "مصاحبه", number: 1, href: "/dashboard/interview" },
  { id: "resume", label: "رزومه", number: 2, href: "/dashboard/resume" },
  { id: "jobs", label: "آگهی‌ها", number: 3, href: "/dashboard/jobs" },
  { id: "application", label: "درخواست", number: 4, href: "/dashboard/application" },
];

interface DashboardSidebarProps {
  activeTab: string;
}

export default function DashboardSidebar({ activeTab }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-2">
      {tabs.map((tab) => {
        const isActive = pathname.includes(tab.id) || (tab.id === "interview" && pathname === "/dashboard");
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-white"
                : "text-text-secondary hover:bg-gray-100"
            }`}
          >
            {tab.number}. {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}