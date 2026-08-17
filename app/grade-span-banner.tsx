"use client";
import {usePathname} from "next/navigation";

const stages=[
 ["🌸","Preschool","Learning Garden"],
 ["🧱","Elementary","Strong Foundations"],
 ["🧭","Middle School","Explore & Connect"],
 ["🚀","High School","Future Readiness"]
];

export function GradeSpanBanner(){
 const pathname=usePathname();
 if(pathname!=="/")return null;
 return <section aria-label="Academy learning levels" style={{background:"#fff8df",borderBottom:"1px solid #ead58e",padding:"18px clamp(18px,5vw,70px)"}}>
  <div style={{maxWidth:1200,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",gap:18,flexWrap:"wrap"}}>
   <div><small style={{fontWeight:900,letterSpacing:1.5,color:"#1f6a56"}}>ONE ACADEMY • EVERY LEARNING STAGE</small><h2 style={{fontFamily:"Georgia,serif",fontSize:"clamp(1.45rem,3vw,2.2rem)",margin:"5px 0"}}>Preschool through high school</h2></div>
   <div style={{display:"flex",gap:9,flexWrap:"wrap"}}>{stages.map(([icon,level,title])=><a key={level} href="/tour#levels" style={{background:"white",border:"1px solid #dfd5b4",borderRadius:12,padding:"9px 12px",color:"#17362f",textDecoration:"none"}}><b>{icon} {level}</b><small style={{display:"block",color:"#6e7f79",marginTop:3}}>{title}</small></a>)}</div>
  </div>
 </section>
}