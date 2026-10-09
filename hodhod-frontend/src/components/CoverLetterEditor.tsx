"use client";

import { useState } from "react";

const defaultLetter = `سلام وقت بخیر،

من سارا کریمی، دانشجوی سال آخر مهندسی کامپیوتر هستم و برای فرصت کارآموزی فرانت‌اند در نگاره‌پردازان درخواست می‌دهم.

در پروژه‌ی فروشگاه آنلاین کتاب، صفحه‌ی محصولات و سبد خرید را با React و به‌صورت ریسپانسیو ساختم و زمان بارگذاری صفحه‌ی اصلی را از ۴ ثانیه به .۸ ثانیه رساندم. در دوره‌ی کارآموزی در استودیو نگاره هم سه کامپوننت قابل‌استفاده‌ی مجدد نوشتم و در بازبینی کد شرکت کردم.

نوشتن تست با Jest را هنوز در پروژه‌های واقعی انجام نداده‌ام و در حال یادگیری آن هستم.

رزومه‌ام پیوست است. خوشحال می‌شوم درباره‌ی کار با شما صحبت کنیم.

با احترام
سارا کریمی`;

export default function CoverLetterEditor() {
  const [activeTab, setActiveTab] = useState<"letter" | "resume">("letter");
  const [letter, setLetter] = useState(defaultLetter);

  return (
    <div className="bg-surface rounded-2xl border border-gray-200 overflow-hidden">
      {/* تب‌ها */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("letter")}
          className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
            activeTab === "letter"
              ? "bg-primary/5 text-primary border-b-2 border-primary"
              : "text-text-secondary hover:bg-gray-50"
          }`}
        >
          نامه‌ی همراه
        </button>
        <button
          onClick={() => setActiveTab("resume")}
          className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
            activeTab === "resume"
              ? "bg-primary/5 text-primary border-b-2 border-primary"
              : "text-text-secondary hover:bg-gray-50"
          }`}
        >
          رزومه‌ی تنظیم‌شده
        </button>
      </div>

      {/* محتوا */}
      <div className="p-6">
        {activeTab === "letter" ? (
          <>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs text-text-secondary">متن نامه (قابل‌ویرایش)</span>
            </div>
            <textarea
              value={letter}
              onChange={(e) => setLetter(e.target.value)}
              className="w-full min-h-[400px] px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-text-primary text-sm leading-relaxed resize-y"
            />
          </>
        ) : (
          <div className="bg-gray-50 rounded-xl p-6 border border-dashed border-gray-300 min-h-[400px] flex items-center justify-center">
            <p className="text-text-secondary text-sm">
              رزومه‌ی تنظیم‌شده برای این آگهی در این تب نمایش داده می‌شود.
            </p>
          </div>
        )}
      </div>

      {/* دکمه‌های اقدام */}
      <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3">
        <button className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors">
          کپی نامه
        </button>
        <button className="flex-1 px-4 py-3 border border-gray-300 text-text-primary rounded-xl font-medium hover:bg-gray-50 transition-colors">
          کپی رزومه
        </button>
        <button className="flex-1 px-4 py-3 border border-gray-300 text-text-primary rounded-xl font-medium hover:bg-gray-50 transition-colors">
          لحنش را رسمی‌تر کن
        </button>
      </div>
    </div>
  );
}