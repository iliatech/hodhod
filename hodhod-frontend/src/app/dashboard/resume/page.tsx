import ResumePreview from "@/components/ResumePreview";
import ResumeReadiness from "@/components/ResumeReadiness";

export default function ResumePage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* سمت چپ - پیش‌نمایش رزومه ( ستون) */}
      <div className="lg:col-span-7">
        <ResumePreview />
      </div>

      {/* سمت راست - آمادگی رزومه (۵ ستون) */}
      <div className="lg:col-span-5">
        <ResumeReadiness />
      </div>
    </div>
  );
}