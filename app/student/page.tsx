import crypto from "node:crypto";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {getChatGPTUser} from "../chatgpt-auth";
import {isAdministrator} from "../access-control";

export const dynamic="force-dynamic";
// Student PIN settings are read at runtime from the current Vercel deployment.
type StudentKey="jerome"|"kameron"|"marilyn";
const portals:Record<StudentKey,{name:string;grade:string;title:string;description:string;url:string}>={
 jerome:{name:"Jerome",grade:"Grade 10",title:"Jerome’s Next Level",description:"Academics, executive function, careers, technology, life skills and leadership.",url:"https://jeromes-next-level.jes-84.chatgpt.site"},
 kameron:{name:"Kameron",grade:"Grade 3",title:"Dodger Learning World",description:"Reading, math, confidence, routines, games, hands-on discovery and affirmations.",url:"https://dodger-learning-world.jes-84.chatgpt.site"},
 marilyn:{name:"Marilyn",grade:"Early Learning",title:"Marilyn’s Learning Garden",description:"Music, dance, stories, movement, sensory play, art and early-life skills.",url:"/student/marilyn"}
};
const COOKIE="wr_student_portal";
function safeEqual(left:string,right:string){const a=Buffer.from(left);const b=Buffer.from(right);return a.length===b.length&&crypto.timingSafeEqual(a,b)}
function signature(student:StudentKey,expires:string,secret:string){return crypto.createHmac("sha256",secret).update(`${student}.${expires}`).digest("hex")}
function sessionSecret(){
 if(process.env.STUDENT_SESSION_SECRET)return process.env.STUDENT_SESSION_SECRET;
 const pair=`${process.env.JEROME_STUDENT_PIN??""}:${process.env.KAMERON_STUDENT_PIN??""}:${process.env.MARILYN_STUDENT_PIN??""}`;
 return pair!=="::"?crypto.createHash("sha256").update(`weems-rosenduft-academy:${pair}`).digest("hex"):undefined;
}
function readStudentSession(value:string|undefined,secret:string|undefined):StudentKey|null{if(!value||!secret)return null;const [student,expires,sig]=value.split(".");if((student!=="jerome"&&student!=="kameron"&&student!=="marilyn")||!expires||!sig||Number(expires)<Date.now())return null;return safeEqual(sig,signature(student,expires,secret))?student:null}

async function studentLogin(formData:FormData){
 "use server";
 const student=String(formData.get("student")??"") as StudentKey;const pin=String(formData.get("pin")??"").trim();
 if(student!=="jerome"&&student!=="kameron"&&student!=="marilyn")redirect("/student?error=student");
 const expected=student==="jerome"?process.env.JEROME_STUDENT_PIN:student==="kameron"?process.env.KAMERON_STUDENT_PIN:process.env.MARILYN_STUDENT_PIN;const secret=sessionSecret();
 if(!expected||!secret)redirect(`/student?error=setup&student=${student}`);
 if(!safeEqual(pin,expected))redirect(`/student?error=pin&student=${student}`);
 const expires=String(Date.now()+1000*60*60*12);const value=`${student}.${expires}.${signature(student,expires,secret)}`;
 (await cookies()).set(COOKIE,value,{httpOnly:true,secure:true,sameSite:"lax",path:"/",maxAge:60*60*12});redirect("/student");
}
async function studentLogout(){"use server";(await cookies()).delete(COOKIE);redirect("/student")}

export default async function StudentPage({searchParams}:{searchParams:Promise<{error?:string;student?:string}>}){
 const params=await searchParams;const user=await getChatGPTUser();const admin=Boolean(user&&isAdministrator(user.email));
 const student=readStudentSession((await cookies()).get(COOKIE)?.value,sessionSecret());const choices=admin?Object.values(portals):student?[portals[student]]:[];
 const missingSetup=[!process.env.JEROME_STUDENT_PIN&&"JEROME_STUDENT_PIN",!process.env.KAMERON_STUDENT_PIN&&"KAMERON_STUDENT_PIN",!process.env.MARILYN_STUDENT_PIN&&"MARILYN_STUDENT_PIN"].filter(Boolean).join(", ");
 if(!choices.length)return <main className="studentGate"><section className="studentChoiceGate">
  <img src="/branding/weems-rosenduft-academy-logo.jpg" alt="Academy logo"/><small>WEEMS-ROSENDUFT ACADEMY</small><h1>Who is learning today?</h1><p>Choose a student and enter their private Academy PIN.</p>
  {params.error==="pin"&&<p className="studentLoginError">That PIN was not correct. Please try again.</p>}{params.error==="setup"&&<p className="studentLoginError">Secure setup missing: {missingSetup||"redeploy required"}.</p>}
  <div className="studentLoginChoices">{(Object.keys(portals) as StudentKey[]).map(key=><form action={studentLogin} key={key} className={params.student===key?"selected":""}>
   <input type="hidden" name="student" value={key}/><b>{portals[key].name[0]}</b><h2>{portals[key].name}</h2><small>{portals[key].grade}</small><label>Private PIN<input name="pin" type="password" inputMode="numeric" autoComplete="current-password" required placeholder="Enter PIN"/></label><button type="submit">Open {portals[key].name}’s portal →</button>
  </form>)}</div><p className="parentAccess">Parent or administrator? <a href="/admin">Open administrator login</a></p><a href="/">← Return to the Academy homepage</a>
 </section></main>;
 return <main className="studentPortal"><nav><a href="/"><img src="/branding/weems-rosenduft-academy-logo.jpg" alt="Academy logo"/>Academy home</a><form action={studentLogout}><button type="submit">Switch student</button></form></nav><header><small>PERSONALIZED STUDENT ACCESS</small><h1>{admin?"Choose a student portal":`Welcome, ${choices[0].name}`}</h1><p>Open the assigned learning world and continue the current quarterly journey.</p></header><section>{choices.map(entry=><article key={entry.name}><span>{entry.name[0]}</span><small>{entry.grade}</small><h2>{entry.title}</h2><p>{entry.description}</p><a href={entry.url}>Open {entry.name}’s lessons →</a></article>)}</section></main>;
}
