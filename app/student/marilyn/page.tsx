import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getChatGPTUser, isAdministrator } from "../../chatgpt-auth";

export const dynamic = "force-dynamic";

function safeEqual(left:string,right:string){
 const a=Buffer.from(left); const b=Buffer.from(right);
 return a.length===b.length && crypto.timingSafeEqual(a,b);
}
function sessionSecret(){
 return crypto.createHash("sha256").update(`${process.env.STUDENT_SESSION_SECRET??""}:${process.env.JEROME_STUDENT_PIN??""}:${process.env.KAMERON_STUDENT_PIN??""}:${process.env.MARILYN_STUDENT_PIN??""}`).digest();
}
function validMarilynSession(value?:string){
 if(!value || !process.env.STUDENT_SESSION_SECRET) return false;
 const [student,expires,signature]=value.split(".");
 if(student!=="marilyn" || !expires || !signature || Number(expires)<Date.now()) return false;
 const expected=crypto.createHmac("sha256",sessionSecret()).update(`${student}.${expires}`).digest("hex");
 return safeEqual(signature,expected);
}

const activities=[
 ["Music & Dance","Move to rhythm, copy patterns, freeze and start, and explore fast/slow and loud/soft."],
 ["Story & Language","Short read-alouds, picture naming, songs, nursery rhymes and simple conversations."],
 ["Early Math","Count toys, match shapes, sort colors, compare more/less and build simple patterns."],
 ["Sensory Art","Paint, dough, collage, water play and safe texture exploration with an adult."],
 ["Movement & Life Skills","Handwashing, brushing teeth, cleanup routines and following simple directions."],
 ["Family Classroom","Join music, Bible study, address practice, media discussion and family celebrations at her level."]
];
const week=[
 ["Monday","Story, counting, movement and family science/art time when appropriate"],
 ["Tuesday","Music, dance and rhythm"],
 ["Wednesday","Family group lesson and sensory play"],
 ["Thursday","Early literacy, building and practical-life play"],
 ["Friday","Art, movement, favorite activity and celebration"]
];

export default async function MarilynPage(){
 const user=await getChatGPTUser();
 const cookieStore=await cookies();
 const allowed=isAdministrator(user) || validMarilynSession(cookieStore.get("wr_student_portal")?.value);
 if(!allowed) redirect("/student?error=student");
 return <main style={{minHeight:"100vh",background:"linear-gradient(135deg,#fff2f5,#f2eaff,#e7fbf3)",color:"#3d3150",padding:"24px",fontFamily:"Arial,sans-serif"}}><div style={{maxWidth:1050,margin:"0 auto"}}><nav style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><a href="/student" style={{color:"#3d3150",fontWeight:800,textDecoration:"none"}}>← Student portal</a><a href="/year-plan" style={{color:"#3d3150"}}>Full-year journey</a></nav><header style={{textAlign:"center",padding:"44px 12px 24px"}}><span style={{fontSize:70}}>🎵</span><small style={{display:"block",letterSpacing:3,fontWeight:800}}>WEEMS-ROSENDUFT ACADEMY</small><h1 style={{fontFamily:"Georgia,serif",fontSize:"clamp(2.6rem,7vw,5rem)",margin:"10px"}}>Marilyn’s Learning Garden</h1><p style={{fontSize:18,maxWidth:700,margin:"0 auto",lineHeight:1.7}}>Playful early learning through music, dance, stories, movement, art, sensory discovery and family connection. Adult-guided, short, flexible and joyful.</p></header><section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:16}}>{activities.map(([title,text],i)=><article key={title} style={{background:"rgba(255,255,255,.9)",borderRadius:24,padding:22,boxShadow:"0 10px 30px #8a6ca122"}}><span style={{fontSize:34}}>{["💃","📖","🔢","🎨","🫧","👨‍👩‍👧‍👦"][i]}</span><h2 style={{fontFamily:"Georgia,serif"}}>{title}</h2><p style={{lineHeight:1.6}}>{text}</p><b>10–15 minute invitation</b></article>)}</section><section style={{marginTop:22,background:"white",borderRadius:24,padding:24}}><h2 style={{fontFamily:"Georgia,serif"}}>Marilyn’s gentle weekly rhythm</h2>{week.map(([day,focus])=><p key={day}><b>{day}:</b> {focus}</p>)}<p style={{background:"#fff2cf",padding:16,borderRadius:14}}><b>Caregiver note:</b> Stop while the activity is still fun. Talking, pointing, moving, singing and playing all count as learning evidence.</p></section></div></main>
}