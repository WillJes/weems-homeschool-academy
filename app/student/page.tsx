import {SignIn} from "@clerk/nextjs";
import {getChatGPTUser} from "../chatgpt-auth";
import {studentForEmail} from "../access-control";

export const dynamic="force-dynamic";
const portals={jerome:{name:"Jerome",grade:"Grade 10",title:"Jerome’s Next Level",description:"Academics, executive function, careers, technology, life skills and leadership.",url:"https://jeromes-next-level.jes-84.chatgpt.site"},kameron:{name:"Kameron",grade:"Grade 3",title:"Dodger Learning World",description:"Reading, math, confidence, routines, games, hands-on discovery and affirmations.",url:"https://dodger-learning-world.jes-84.chatgpt.site"}};

export default async function StudentPage(){
 const user=await getChatGPTUser();
 if(!user)return <main className="studentGate"><section><img src="/branding/weems-rosenduft-academy-logo.jpg" alt="Academy logo"/><small>WEEMS-ROSENDUFT ACADEMY</small><h1>Student Portal</h1><p>Sign in with an approved student account. Each learner will be taken to their own personalized learning world.</p><SignIn routing="hash" forceRedirectUrl="/student" fallbackRedirectUrl="/student"/><a href="/">← Return to the Academy homepage</a></section></main>;
 const access=studentForEmail(user.email);
 if(!access)return <main className="studentGate"><section><img src="/branding/weems-rosenduft-academy-logo.jpg" alt="Academy logo"/><small>STUDENT ACCESS</small><h1>Student account not connected</h1><p><strong>{user.email}</strong> is signed in but has not been assigned to a student portal yet. Ask the administrator to add this email.</p><a href="/">← Return to the Academy homepage</a></section></main>;
 const choices=access==="administrator"?Object.values(portals):[portals[access]];
 return <main className="studentPortal"><nav><a href="/"><img src="/branding/weems-rosenduft-academy-logo.jpg" alt="Academy logo"/>Academy home</a><span>Signed in as {user.email}</span></nav><header><small>PERSONALIZED STUDENT ACCESS</small><h1>{access==="administrator"?"Choose a student portal":`Welcome, ${choices[0].name}`}</h1><p>Open the assigned learning world and continue the current quarterly journey.</p></header><section>{choices.map(student=><article key={student.name}><span>{student.name[0]}</span><small>{student.grade}</small><h2>{student.title}</h2><p>{student.description}</p><a href={student.url}>Open {student.name}’s portal →</a></article>)}</section><aside><b>Security note</b><p>This Academy gateway checks the student account first. The older student sites are hosted separately and will be fully protected when their content is migrated under this Academy domain.</p></aside></main>;
}
