import AuthForm from "@/components/AuthForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* سمت راست - معرفی پلتفرم */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-text-primary">همراه کاریابی</h1>
          </div>

          <h2 className="text-4xl font-bold text-text-primary leading-tight">
            آگهی مناسب را پیدا کن،
            <br />
            رزومه‌ات را با هم می‌سازیم
          </h2>

          <p className="text-text-secondary text-lg leading-relaxed">
            از یک مصاحبه کوتاه شروع می‌کنیم، تو را می‌شناسیم و هر آگهی را با سوایق واقعی‌ات
            می‌سنجیم. دلیل هر پیشنهاد را هم می‌گوییم.
          </p>

          {/* کارت قول به تو */}
          <div className="bg-accent-success/10 border border-accent-success/20 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-accent-success rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-text-primary mb-2">قول به تو</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  چیزی که نداری به رزومه‌ات اضافه نمی‌کنم. اگر مهارت کم باشد، دقیق می‌گویم و راه جایگزین پیشنهاد می‌دهم.
                </p>
              </div>
            </div>
          </div>

          {/* ویژگی‌ها */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-accent-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-text-primary">مصاحبه گام‌به‌گام</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-accent-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-text-primary">تناسب هر آگهی با دلیل</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-accent-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-text-primary">رزومه قابل‌ویرایش</span>
            </div>
          </div>
        </div>

        {/* سمت چپ - فرم ثبت‌نام */}
        <AuthForm />
      </div>
    </div>
  );
}