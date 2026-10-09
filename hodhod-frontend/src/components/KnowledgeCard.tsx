interface Skill {
  name: string;
  level?: "مقدماتی" | "متوسط" | "پیشرفته";
}

const skills: Skill[] = [
  { name: "HTML" },
  { name: "CSS" },
  { name: "JavaScript" },
  { name: "Git" },
  { name: "React", level: "مقدماتی" },
];

const emptySections = ["پروژه‌ها", "تجربه‌ها", "تحصیلات", "زبان‌ها"];

export default function KnowledgeCard() {
  return (
    <div className="bg-surface rounded-2xl border border-gray-200 p-6 space-y-5">
      <h2 className="text-lg font-bold text-text-primary">آنچه تا حالا از تو می‌دانم</h2>

      {/* هدف شغلی */}
      <div className="flex items-start justify-between pb-4 border-b border-gray-100">
        <div>
          <div className="text-xs text-text-secondary mb-1">هدف شغلی</div>
          <div className="font-medium text-text-primary">کارآموز فرانت‌اند</div>
        </div>
        <button className="text-xs text-primary hover:underline">ویرایش</button>
      </div>

      {/* مهارت‌ها */}
      <div className="pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-text-secondary">مهارت‌ها</div>
          <button className="text-xs text-primary hover:underline">ویرایش</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill.name}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                skill.level
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : "bg-gray-100 text-text-primary border border-gray-200"
              }`}
            >
              {skill.name}
              {skill.level && <span className="mr-1">· {skill.level}</span>}
            </span>
          ))}
        </div>
      </div>

      {/* ترجیحات */}
      <div className="pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-text-secondary">ترجیحات</div>
          <button className="text-xs text-primary hover:underline">ویرایش</button>
        </div>
        <div className="text-sm text-text-primary">تهران یا دورکاری · سطح کارآموز</div>
      </div>

      {/* بخش‌های خالی */}
      <div className="bg-gray-50 rounded-xl p-4 border border-dashed border-gray-300">
        <div className="text-xs text-text-secondary mb-2">هنوز خالی است:</div>
        <div className="text-sm text-text-primary">
          {emptySections.join("، ")} در مراحل بعد می‌پرسم.
        </div>
      </div>

      {/* دکمه مشاهده رزومه */}
      <button className="w-full py-3 border-2 border-primary text-primary rounded-xl font-medium hover:bg-primary/5 transition-colors">
        رزومه‌ی زنده را ببین
      </button>
    </div>
  );
}