"use client";

import { useState } from "react";

const filters = [
  { id: "all", label: "همه" },
  { id: "best", label: "مناسب‌ترین‌ها" },
  { id: "remote", label: "دورکاری" },
  { id: "tehran", label: "تهران" },
];

export default function FilterTabs() {
  const [active, setActive] = useState("all");

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => setActive(filter.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            active === filter.id
              ? "bg-gray-900 text-white"
              : "bg-surface text-text-primary border border-gray-200 hover:bg-gray-50"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}