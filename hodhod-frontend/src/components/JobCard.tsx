"use client";

import { useState } from "react";

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  workType: string;
  daysAgo: string;
  matchPercent: number;
  matchedSkills: number;
  totalSkills: number;
  matchedTags: string[];
  missingTags: string[];
  missingDescription: string;
  status: "good" | "partial" | "bad";
}

const statusConfig = {
  good: {
    label: "مناسب است",
    labelColor: "text-accent-success",
    ringColor: "stroke-accent-success",
    bgColor: "bg-accent-success",
  },
  partial: {
    label: "نیمه‌مناسب است",
    labelColor: "text-accent-warning",
    ringColor: "stroke-accent-warning",
    bgColor: "bg-accent-warning",
  },
  bad: {
    label: "فعلاً مناسب نیست",
    labelColor: "text-accent-error",
    ringColor: "stroke-accent-error",
    bgColor: "bg-accent-error",
  },
};

export default function JobCard({
  title,
  company,
  location,
  workType,
  daysAgo,
  matchPercent,
  matchedSkills,
  totalSkills,
  matchedTags,
  missingTags,
  missingDescription,
  status,
}: JobCardProps) {
  const [showReasons, setShowReasons] = useState(false);
  const config = statusConfig[status];

  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (matchPercent / 100) * circumference;

  return (
    <div className="bg-surface rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-5">
        {/* دایره درصد تطابق */}
        <div className="relative flex-shrink-0">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle cx="40" cy="40" r={radius} stroke="#E5E7EB" strokeWidth="5" fill="none" />
            <circle
              cx="40"
              cy="40"
              r={radius}
              className={config.ringColor}
              strokeWidth="5"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-text-primary">{matchPercent}٪</span>
          </div>
        </div>

        {/* اطلاعات آگهی */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1">
            <div>
              <h3 className="text-lg font-bold text-text-primary mb-1">{title}</h3>
              <div className="text-sm text-text-secondary">
                {company} · {location} · {workType} · {daysAgo} پیش
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className={`font-bold ${config.labelColor}`}>{config.label}</div>
              <div className="text-xs text-text-secondary">
                {matchedSkills} از {totalSkills} مهارت
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* چرا مناسب است */}
      <div className="mt-5 pt-5 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-accent-success"></div>
          <span className="text-sm font-medium text-text-primary">چرا مناسب است</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {matchedTags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 bg-gray-100 text-text-primary rounded-lg text-xs font-medium border border-gray-200"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">
          آگهی برای سطح کارآموز است و با سطح فعلی تو می‌خواند.
        </p>
      </div>

      {/* چه چیزی کم است */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-accent-warning"></div>
          <span className="text-sm font-medium text-text-primary">چه چیزی کم است</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {missingTags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium border border-amber-200"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">{missingDescription}</p>
      </div>

      {/* دکمه‌های دلیل و اقدام */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        <button
          onClick={() => setShowReasons(!showReasons)}
          className="text-sm text-primary hover:underline mb-4 block"
        >
          {showReasons ? "بستن دلایل" : "این آگهی را کنار گذاشتی. دلیلش چه بود؟"}
        </button>

        {showReasons && (
          <div className="flex flex-wrap gap-2 mb-4">
            {["حقوق", "شهر یا دورکاری", "سطح سنی‌ن است", "مهارت‌ها", "شرکت"].map((reason) => (
              <button
                key={reason}
                className="px-3 py-1.5 bg-gray-100 text-text-primary rounded-lg text-xs border border-gray-200 hover:bg-gray-200 transition-colors"
              >
                {reason}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors">
            ساخت درخواست برای این آگهی
          </button>
          <button className="px-4 py-3 border border-gray-300 text-text-primary rounded-xl font-medium hover:bg-gray-50 transition-colors">
            ذخیره
          </button>
          <button className="px-4 py-3 border border-gray-300 text-text-primary rounded-xl font-medium hover:bg-gray-50 transition-colors">
            مناسب نیست
          </button>
        </div>
      </div>
    </div>
  );
}