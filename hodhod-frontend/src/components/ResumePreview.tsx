"use client";
import { useEffect, useState } from "react";
import { api, Profile } from "@/lib/api";
type Resume = { id:number; title:string; target_role:string; content:Record<string,any>; created_at?:string };
const asText=(v:any):string=>Array.isArray(v)?v.map(x=>typeof x==="string"?x:JSON.stringify(x)).join("، "):typeof v==="string"?v:v==null?"":JSON.stringify(v,null,2);
export default function ResumePreview(){
 const [resume,setResume]=useState<Resume|null>(null);const [profile,setProfile]=useState<Profile|null>(null);const [loading,setLoading]=useState(true);const [error,setError]=useState("");
 useEffect(()=>{(async()=>{try{const p=await api<Profile>("/api/profile");setProfile(p);const list=await api<any[]>("/api/resumes");if(list.length){const latest=await api<Resume>(`/api/resumes/${list[0].id}`);setResume(latest);}}catch(e){setError(e instanceof Error?e.message:"بارگذاری رزومه ناموفق بود")}finally{setLoading(false)}})()},[]);
 const content=resume?.content||{}; const name=content.full_name||content.name||"نام شما"; const summary=content.summary||content.professional_summary||content.profile||"پس از مصاحبه با دستیار، رزومه بر اساس اطلاعات تأییدشده‌ات اینجا نمایش داده می‌شود.";
 if(loading)return <div className="bg-surface rounded-2xl border border-gray-200 p-8">در حال بارگذاری رزومه…</div>;
 return <div className="bg-surface rounded-2xl border border-gray-200 p-8 shadow-sm"><div className="text-center mb-8 pb-6 border-b border-gray-200"><h1 className="text-3xl font-bold text-text-primary mb-2">{name}</h1><div className="text-primary font-medium mb-3">{resume?.target_role||profile?.target_role||"عنوان شغلی هدف"}</div><div className="text-sm text-text-secondary">{profile?.location||"مکان"} {profile?.location&&profile?.skills?.length?"·":""} {profile?.skills?.length?profile.skills.slice(0,4).join(" · "):""}</div></div>
 {error&&<p role="alert" className="text-red-600 text-sm mb-4">{error}</p>}{!resume&&<div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm">هنوز رزومه‌ای تولید نشده است. ابتدا مصاحبه را در بخش «مصاحبه» کامل کن و گزینهٔ ساخت رزومه را بزن.</div>}
 {Object.entries(content).filter(([k])=>!['full_name','name','target_role','tailoring_notes'].includes(k)).map(([key,value])=><section key={key} className="mb-6"><h2 className="text-lg font-bold text-text-primary mb-3">{key.replace(/_/g," ")}</h2>{Array.isArray(value)?<ul className="list-disc list-inside space-y-2 text-sm text-text-secondary">{value.map((v,i)=><li key={i}>{typeof v==="object"?Object.entries(v).map(([k,val])=>`${k.replace(/_/g," ")}: ${asText(val)}`).join(" · "):String(v)}</li>)}</ul>:<p className="text-sm text-text-secondary leading-7 whitespace-pre-line">{asText(value)}</p>}</section>)}
 {content.tailoring_notes&&<section className="mt-6 p-4 rounded-xl bg-emerald-50"><h2 className="font-bold mb-2">یادداشت‌های دستیار</h2><p className="text-sm leading-6">{asText(content.tailoring_notes)}</p></section>}
 <div className="mt-6 flex gap-3"><button onClick={()=>window.print()} className="btn-primary">چاپ / ذخیره PDF</button><button onClick={()=>navigator.clipboard.writeText(JSON.stringify(content,null,2))} className="px-4 py-3 border border-gray-300 rounded-xl text-sm">کپی محتوای رزومه</button></div>
 </div>
}
