import KnowledgeCard from "@/components/KnowledgeCard";
import ChatInterface from "@/components/ChatInterface";

export default function InterviewPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* ستون چپ - کارت دانش (۴ ستون) */}
      <div className="lg:col-span-4">
        <KnowledgeCard />
      </div>

      {/* ستون راست - چت ( ستون) */}
      <div className="lg:col-span-8">
        <ChatInterface />
      </div>
    </div>
  );
}