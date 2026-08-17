import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getChatGPTUser } from "../../chatgpt-auth";
import { isAdministrator } from "../../access-control";

export const dynamic = "force-dynamic";

function safeEqual(left:string,right:string){
 const a=Buffer.from(left); const b=Buffer.from(right);
 return a.length===b.length && crypto.timingSafeEqual(a,b);
}
function sessionSecret(){
 if(process.env.STUDENT_SESSION_SECRET)return process.env.STUDENT_SESSION_SECRET;
 const pair=`${process.env.JEROME_STUDENT_PIN??""}:${process.env.KAMERON_STUDENT_PIN??""}:${process.env.MARILYN_STUDENT_PIN??""}`;
 return pair!=="::"?crypto.createHash("sha256").update(`weems-rosenduft-academy:${pair}`).digest("hex"):undefined;
}
function validMarilynSession(value?:string){
 if(!value || !process.env.STUDENT_SESSION_SECRET) return false;
 const [student,expires,signature]=value.split(".");
 if(student!=="marilyn" || !expires || !signature || Number(expires)<Date.now()) return false;
 const secret=sessionSecret();
 if(!secret)return false;
 const expected=crypto.createHmac("sha256",secret).update(`${student}.${expires}`).digest("hex");
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
const videos=[
 {icon:"💃",title:"Songs & Dancing",source:"PBS KIDS",url:"https://pbskids.org/videos/playlist/almas-way-songs-dancing/1262632",purpose:"Copy movements, follow rhythm, and enjoy short songs together.",prompt:"Can you copy one move, then make up your own?"},
 {icon:"🎶",title:"PBS KIDS Songs",source:"PBS KIDS",url:"https://pbskids.org/videos/playlist/pbs-kids-songs/1426135",purpose:"Sing, bounce, clap, and practice start-and-stop listening.",prompt:"Clap the beat and name one word you heard."},
 {icon:"🧸",title:"Preschool Learning Videos",source:"Sesame Street",url:"https://www.sesamestreet.org/videos",purpose:"Explore feelings, friendship, routines, letters, numbers, music, and movement.",prompt:"What did the character feel or do?"},
 {icon:"👏",title:"Follow Me",source:"Super Simple Songs",url:"https://supersimple.com/song/follow-me/",purpose:"Practice one-step directions through clapping, spinning, bending, and touching.",prompt:"Take turns being the leader."},
 {icon:"😊",title:"My Happy Song",source:"Super Simple Songs",url:"https://supersimple.com/song/my-happy-song-featuring-noodle-pals/",purpose:"Name happy feelings and experiment with fast, slow, high, and low voices.",prompt:"Show a happy face and choose a silly voice."},
 {icon:"🥁",title:"Making Music",source:"Super Simple",url:"https://supersimple.com/content-topic/making-music/",purpose:"Explore rhythm, instruments, singing, movement, and simple music activities.",prompt:"Make a safe shaker and copy a two-beat pattern."}
];

export default async function MarilynPage(){
 const user=await getChatGPTUser();
 const cookieStore=await cookies();
 const allowed=Boolean(user&&isAdministrator(user.email)) || validMarilynSession(cookieStore.get("wr_student_portal")?.value);
 if(!allowed) redirect("/student?error=student");
 return <main style={{minHeight:"100vh",background:"linear-gradient(135deg,#fff2f5,#f2eaff,#e7fbf3)",color:"#3d3150",padding:"24px",fontFamily:"Arial,sans-serif"}}><div style={{maxWidth:1050,margin:"0 auto"}}><nav style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><a href="/student" style={{color:"#3d3150",fontWeight:800,textDecoration:"none"}}>← Student portal</a><a href="/year-plan" style={{color:"#3d3150"}}>Full-year journey</a></nav><header style={{textAlign:"center",padding:"44px 12px 24px"}}><span style={{fontSize:70}}>🎵</span><small style={{display:"block",letterSpacing:3,fontWeight:800}}>WEEMS-ROSENDUFT ACADEMY</small><h1 style={{fontFamily:"Georgia,serif",fontSize:"clamp(2.6rem,7vw,5rem)",margin:"10px"}}>Marilyn’s Learning Garden</h1><p style={{fontSize:18,maxWidth:700,margin:"0 auto",lineHeight:1.7}}>Playful early learning through music, dance, stories, movement, art, sensory discovery and family connection. Adult-guided, short, flexible and joyful.</p></header><section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:16}}>{activities.map(([title,text],i)=><article key={title} style={{background:"rgba(255,255,255,.9)",borderRadius:24,padding:22,boxShadow:"0 10px 30px #8a6ca122"}}><span style={{fontSize:34}}>{["💃","📖","🔢","🎨","🫧","👨‍👩‍👧‍👦"][i]}</span><h2 style={{fontFamily:"Georgia,serif"}}>{title}</h2><p style={{lineHeight:1.6}}>{text}</p><b>10–15 minute invitation</b></article>)}</section><section style={{marginTop:22,background:"white",borderRadius:24,padding:24}}><h2 style={{fontFamily:"Georgia,serif"}}>Marilyn’s gentle weekly rhythm</h2>{week.map(([day,focus])=><p key={day}><b>{day}:</b> {focus}</p>)}<p style={{background:"#fff2cf",padding:16,borderRadius:14}}><b>Caregiver note:</b> Stop while the activity is still fun. Talking, pointing, moving, singing and playing all count as learning evidence.</p></section><section style={{marginTop:22,background:"#45355f",color:"white",borderRadius:24,padding:24}}><small style={{letterSpacing:2,fontWeight:900,color:"#ffd77a"}}>ADULT-GUIDED VIDEO SHELF</small><h2 style={{fontFamily:"Georgia,serif",fontSize:32,marginBottom:8}}>Watch, move, talk, then turn it off</h2><p style={{lineHeight:1.6,maxWidth:760}}>Choose one short video with an adult. Move or sing along, answer the conversation prompt, and follow it with an off-screen activity. These links go to selected educational collections—not an open search page.</p><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14,marginTop:20}}>{videos.map(v=><article key={v.title} style={{background:"white",color:"#3d3150",borderRadius:18,padding:18}}><span style={{fontSize:34}}>{v.icon}</span><small style={{display:"block",fontWeight:900,color:"#765f91",marginTop:8}}>{v.source}</small><h3 style={{fontFamily:"Georgia,serif",fontSize:23,margin:"6px 0"}}>{v.title}</h3><p style={{lineHeight:1.5}}>{v.purpose}</p><p style={{background:"#f5edff",padding:12,borderRadius:12}}><b>Talk together:</b> {v.prompt}</p><a href={v.url} target="_blank" rel="noopener noreferrer" style={{display:"inline-block",background:"#ffd15c",color:"#352746",padding:"11px 14px",borderRadius:10,fontWeight:900,textDecoration:"none"}}>Open approved video page ↗</a></article>)}</div><p style={{marginTop:18,fontSize:14,color:"#eee4fb"}}><b>Safety:</b> An adult chooses the video, stays nearby, keeps autoplay off when possible, and closes the page after the activity.</p></section></div></main>
}
