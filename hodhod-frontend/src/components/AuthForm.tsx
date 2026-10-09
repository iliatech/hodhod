"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, saveSession, ApiUser } from "@/lib/api";

export default function AuthForm() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      const result = await api<{access_token:string; user:ApiUser}>(isLogin ? "/api/auth/login" : "/api/auth/register", { method:"POST", body: JSON.stringify(isLogin ? { email: formData.email, password: formData.password } : { full_name: formData.name, email: formData.email, password: formData.password }) });
      saveSession(result.access_token, result.user); router.push("/dashboard/interview");
    } catch (err) { setError(err instanceof Error ? err.message : "ورود ناموفق بود"); } finally { setBusy(false); }
  };
  return <div className="card max-w-md mx-auto w-full">
    <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
      <button type="button" onClick={() => {setIsLogin(false);setError("");}} className={`flex-1 py-2 px-4 rounded-md font-medium ${!isLogin ? "bg-white text-text-primary shadow-sm" : "text-text-secondary"}`}>ثبت‌نام</button>
      <button type="button" onClick={() => {setIsLogin(true);setError("");}} className={`flex-1 py-2 px-4 rounded-md font-medium ${isLogin ? "bg-white text-text-primary shadow-sm" : "text-text-secondary"}`}>ورود</button>
    </div>
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isLogin && <div><label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">نام</label><input id="name" value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})} className="input-field" placeholder="مثلاً سارا" required minLength={2}/></div>}
      <div><label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">ایمیل</label><input id="email" type="email" value={formData.email} onChange={e=>setFormData({...formData,email:e.target.value})} className="input-field" placeholder="name@example.com" required/></div>
      <div><label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">رمز عبور</label><input id="password" type="password" value={formData.password} onChange={e=>setFormData({...formData,password:e.target.value})} className="input-field" placeholder="حداقل ۸ نویسه" required minLength={8}/></div>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <button disabled={busy} type="submit" className="btn-primary w-full mt-6 disabled:opacity-60">{busy ? "لطفاً صبر کن…" : isLogin ? "ورود" : "ساخت حساب و شروع مصاحبه"}</button>
    </form><p className="text-center text-text-secondary text-sm mt-4">پروفایل و رزومه‌ات فقط برای خودت ذخیره می‌شود.</p>
  </div>;
}
