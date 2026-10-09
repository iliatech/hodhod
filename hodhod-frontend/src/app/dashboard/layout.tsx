"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import UserProfile from "@/components/UserProfile";
import { api, clearSession, ApiUser } from "@/lib/api";
export default function DashboardLayout({children}:{children:React.ReactNode}){
 const router=useRouter();const [user,setUser]=useState<ApiUser|null>(null);const [checking,setChecking]=useState(true);
 useEffect(()=>{(async()=>{try{const u=await api<ApiUser>("/api/auth/me");setUser(u)}catch{clearSession();router.replace("/")}finally{setChecking(false)}})()},[router]);
 if(checking)return <div className="min-h-screen flex items-center justify-center text-text-secondary">در حال بررسی حساب کاربری…</div>;
 if(!user)return null;
 return <div className="min-h-screen bg-background"><header className="bg-surface border-b border-gray-200 sticky top-0 z-50"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="flex items-center justify-between gap-3 min-h-16 py-2"><div className="flex items-center gap-3"><div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center"><svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></div><span className="font-bold text-lg text-text-primary hidden sm:block">همراه کاریابی</span></div><DashboardSidebar activeTab="interview"/><div className="flex items-center gap-3"><UserProfile name={user.full_name}/><button onClick={()=>{clearSession();router.replace("/")}} className="text-xs text-text-secondary hover:text-red-600">خروج</button></div></div></div></header><main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main></div>
}
