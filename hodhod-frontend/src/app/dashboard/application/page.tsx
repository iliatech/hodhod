import CoverLetterEditor from "@/components/CoverLetterEditor";
import ApplicationStatus from "@/components/ApplicationStatus";

export default function ApplicationPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary mb-2">گام چهارم · درخواست شغلی</p>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">درخواستت را آماده کن</h1>
        <p className="mt-2 text-text-secondary">نامه همراهت را شخصی‌سازی کن و وضعیت درخواست را دنبال کن.</p>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8"><CoverLetterEditor /></div>
        <div className="xl:col-span-4 space-y-6"><ApplicationStatus /></div>
      </div>
    </div>
  );
}
