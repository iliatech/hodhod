"use client";

import { useState } from "react";

const steps = [
  { id: "ready", label: "آماده‌ی ارسال" },
  { id: "sent", label: "ارسال شد" },
  { id: "replied", label: "پاسخ آمد" },
  { id: "interview", label: "مصاحبه" },
];

export default function ApplicationStatus() {
  const [activeStep, setActiveStep] = useState("ready");

  return (
    <div className="bg-surface rounded-2xl border border-gray-200 p-6">
      <h3 className="font-bold text-text-primary mb-4">وضعیت این درخواست</h3>
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <button
              onClick={() => setActiveStep(step.id)}
              className={`flex flex-col items-center gap-2 ${
                index > 0 ? "flex-1" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step.id === activeStep
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-text-secondary"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`text-xs ${
                  step.id === activeStep
                    ? "text-primary font-medium"
                    : "text-text-secondary"
                }`}
              >
                {step.label}
              </span>
            </button>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  steps.findIndex((s) => s.id === activeStep) > index
                    ? "bg-primary"
                    : "bg-gray-200"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-text-secondary text-center">
        بعد از ارسال، وضعیت را عوض کن تا ۷ روز دیگر یادآوری پیگیری برایت بفرستم.
      </p>
    </div>
  );
}