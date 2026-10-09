"use client";

import { useState } from "react";

export default function JobsSidebar() {
  const [feedback, setFeedback] = useState("");

  return (
    <div className="space-y-4">
      {/* ترجیحات من */}
      <div className="bg-surface rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-text-primary">ترجیحات من</h3>
          <button className="text-xs text-primary hover:underline">ویرایش</button>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-text-secondary">هدف</span>
            <span className="text-text-primary font-medium">کارآموز فرانت‌اند</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">شهر</span>
            <span className="text-text-primary font-medium">تهران یا دورکاری</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">سطح</span>
            <span className="text-text-primary font-medium">کارآموز تا تازه‌کار</span>
          </div>
        </div>
      </div>

      {/* بازخوردهای تو یاد گرفتم */}
      <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-6">
        <h3 className="font-bold text-text-primary mb-2">از بازخوردهای تو یاد گرفتم</h3>
        <p className="text-sm text-text-secondary leading-relaxed mb-3">
          «سطح سنی‌ن است» را انتخاب کردی. از این به بعد آگهی‌هایی که چند سال سابقه می‌خواهند پایین‌تر می‌گذارم.
        </p>
        <button className="text-sm text-primary hover:underline font-medium">
          برگرداندن این تغییر
        </button>
      </div>

      {/* آگهی خودت را بسنج */}
      <div className="bg-surface rounded-2xl border-2 border-dashed border-gray-300 p-6">
        <h3 className="font-bold text-text-primary mb-2">آگهی خودت را بسنج</h3>
        <p className="text-sm text-text-secondary mb-4 leading-relaxed">
          متن یا لینک یک آگهی را بچسبان تا همین تحلیل را برایش بسازم.
        </p>
        <textarea
          placeholder="متن آگهی..."
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-text-primary placeholder:text-gray-400 text-sm resize-none"
          rows={4}
        />
      </div>
    </div>
  );
}