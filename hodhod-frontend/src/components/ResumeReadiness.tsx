"use client";

import { useState } from "react";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  status: "done" | "warning" | "error";
}

const checklistItems: ChecklistItem[] = [
  {
    id: "contact",
    title: "نام و راه ارتباطی",
    description: "ایمیل و تلفن ثبت شده است.",
    status: "done",
  },
  {
    id: "skills",
    title: "مهارت‌ها",
    description: "هفت مهارت، تعداد مناسبی است.",
    status: "done",
  },
  {
    id: "metrics",
    title: "نتیجه‌های قابل‌اندازه‌گیری",
    description: "فقط دو خط عدد دارد. یک مورد دیگر، مثل درصد بهبود یا زمان، اضافه کن.",
    status: "warning",
  },
  {
    id: "portfolio",
    title: "گواهی یا نمونه‌کار",
    description: "هنوز لینکی ثبت نکرده‌ای. پیوند گیت‌هاب یا نمونه‌کار به رزومه‌ی کارآموز وزن می‌دهد.",
    status: "error",
  },
];

const statusConfig = {
  done: { color: "bg-accent-success", label: "تکمیل" },
  warning: { color: "bg-accent-warning", label: "نیاز به بهبود" },
  error: { color: "bg-accent-error", label: "خالی" },
};

export default function ResumeReadiness() {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* کارت آمادگی رزومه */}
      <div className="bg-surface rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text-primary">آمادگی رزومه</h2>
          <div className="relative">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="#E5E7EB"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="#2F7A6F"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 28 * 0.7} ${2 * Math.PI * 28 * 0.3}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-text-primary">VAX</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-text-secondary">
          هر مورد را اصلاح کن، فورا به‌روز می‌شود.
        </p>
      </div>

      {/* چک‌لیست */}
      <div className="bg-surface rounded-2xl border border-gray-200 p-6 space-y-4">
        {checklistItems.map((item) => (
          <div key={item.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
            <button
              onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
              className="w-full flex items-start gap-3 text-right"
            >
              <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${statusConfig[item.status].color}`}></div>
              <div className="flex-1">
                <div className="font-medium text-text-primary mb-1">{item.title}</div>
                <div className="text-sm text-text-secondary">{item.description}</div>
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* خلاصه رزومه */}
      <div className="bg-surface rounded-2xl border border-gray-200 p-6">
        <h3 className="font-bold text-text-primary mb-3">خلاصه‌ی رزومه</h3>
        <p className="text-sm text-text-secondary leading-relaxed mb-4">
          دانشجوی مهندسی کامپیوتر و کارآموز فرانت‌اند با تجربه ساخت رابط‌های ریسپانسیو با React.
          به دنبال فرصت کارآموزی برای یادگیری در یک تیم محصول.
        </p>
        <div className="flex gap-2">
          <button className="flex-1 px-4 py-2.5 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary/5 transition-colors">
            کوتاه‌ترش کن
          </button>
          <button className="flex-1 px-4 py-2.5 bg-primary/5 border border-dashed border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary/10 transition-colors">
            پیشنهاد خلاصه را روی اطلاعاتم
          </button>
        </div>
      </div>

      {/* دکمه‌های اقدام */}
      <div className="flex gap-3">
        <button className="flex-1 px-4 py-3 border border-gray-300 text-text-primary rounded-xl font-medium hover:bg-gray-50 transition-colors">
          کپی متن رزومه
        </button>
        <button className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors">
          ادامه: آگهی‌های مناسب
        </button>
      </div>
    </div>
  );
}