"use client";
import {useEffect,useState} from "react";

const quarters=[
 {label:"Quarter 1",title:"Law, Power & the Constitution",focus:"Build the foundation",lessons:["Civil law vs. criminal law","Constitutional rights and civic responsibilities","Federal, state, and local courts","Equal protection and due process"],project:"Create a one-page rights map connecting an amendment, a court, and a real-life example."},
 {label:"Quarter 2",title:"Rights in Public & Police Encounters",focus:"Practice calm, safe language",lessons:["Levels of police encounters in New York City","Asking: ‘Am I free to leave?’","Search consent and the Right to Know Act","Staying safe, not physically resisting, and documenting later"],project:"Complete three role-play scenarios and write a personal safety-and-support plan."},
 {label:"Quarter 3",title:"Civil Rights in Everyday Life",focus:"Recognize unfair treatment",lessons:["School discipline, disability rights, and self-advocacy","Workplace and young-worker protections","Housing, consumer, and contract basics","Discrimination, bias, and how systems can affect Black men differently"],project:"Analyze a fictional case, identify the issue, evidence, and safest next step."},
 {label:"Quarter 4",title:"Evidence, Help & Civic Action",focus:"Turn knowledge into action",lessons:["Facts, timelines, witnesses, and records","Complaint pathways and their limits","Finding a trusted adult or qualified lawyer","Civil-rights careers and community advocacy"],project:"Build a mock case file and present a rights teach-back for the yearly portfolio."}
] as const;

const scenarios=[
 {title:"An officer approaches",prompt:"An officer asks where you are going. You are unsure whether you must stay.",choices:["Run without speaking","Stay calm and ask, ‘Am I free to leave?’","Argue about the law"],answer:1,why:"A calm, direct question helps clarify the encounter. If told you may leave, walk away calmly."},
 {title:"A search is requested",prompt:"An officer asks permission to search your bag.",choices:["Say, ‘I do not consent to a search,’ while keeping your hands visible","Grab the bag back","Give a false name"],answer:0,why:"You can clearly state that you do not consent. Do not physically resist; challenge an unlawful search later with help."},
 {title:"You believe bias occurred",prompt:"After reaching safety, you believe you were treated unfairly because you are Black.",choices:["Post names and guesses immediately","Write the time, place, words, witnesses, and officer information; tell a trusted adult","Confront the officer later alone"],answer:1,why:"A factual record preserves useful details. A trusted adult or lawyer can help choose an appropriate complaint or legal pathway."}
] as const;

const links=[
 ["New York: Know My Rights","https://ag.ny.gov/i-want/know-my-rights"],
 ["NYC CCRB: Police Encounters","https://www.nyc.gov/site/ccrb/complaints/file-a-complaint/know-your-rights.page"],
 ["NYC Right to Know Act","https://www.nyc.gov/site/ccrb/complaints/file-a-complaint/right-to-know-act.page"],
 ["NY Civil Rights Complaint","https://ag.ny.gov/file-complaint/civil-rights"],
 ["Find Legal Services in New York","https://ag.ny.gov/i-want/find-legal-services"],
 ["U.S. DOJ Civil Rights","https://civilrights.justice.gov/"]
] as const;

export function CivilRightsLab({speak}:{speak:(x:string)=>void}){
 const[quarter,setQuarter]=useState(0),[answers,setAnswers]=useState<Record<number,number>>({}),[completed,setCompleted]=useState<boolean[]>([false,false,false,false]),[reflection,setReflection]=useState("");
 useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem("jerome-civil-rights")||"{}");setAnswers(saved.answers||{});setCompleted(saved.completed||[false,false,false,false]);setReflection(saved.reflection||"")}catch{}},[]);
 useEffect(()=>{localStorage.setItem("jerome-civil-rights",JSON.stringify({answers,completed,reflection}))},[answers,completed,reflection]);
 const q=quarters[quarter];
 return <section className="rightsLab"><div className="rightsHero"><div><p className="eyebrow">CIVIL LAW & MY RIGHTS</p><h1>Know your rights. Protect your future.</h1><p>Jerome will study how law works, how civil rights apply in real life, and how Black history and present-day experiences shape the need for informed, calm self-advocacy.</p><button onClick={()=>speak("Know your rights. Stay calm. Keep your hands visible. Do not physically resist. Ask clear questions, reach safety, write down facts, and contact a trusted adult or lawyer.")}>🔊 Hear the safety script</button></div><aside><b>Important</b><p>This is education, not personal legal advice. Laws and situations differ. Safety comes first: stay calm, do not physically resist, document facts afterward, and involve a trusted adult or qualified lawyer.</p></aside></div>
 <div className="rightsBody"><section><div className="quarterTabs">{quarters.map((x,i)=><button key={x.label} className={quarter===i?"active":""} onClick={()=>setQuarter(i)}><small>{x.label}</small><b>{x.title}</b><span>{completed[i]?"✓ Evidence saved":x.focus}</span></button>)}</div><article className="quarterLesson"><div><p className="eyebrow">{q.label} · 90-DAY JOURNEY</p><h2>{q.title}</h2><ul>{q.lessons.map(x=><li key={x}>{x}</li>)}</ul></div><aside><b>Quarter project</b><p>{q.project}</p><button onClick={()=>setCompleted(c=>c.map((x,i)=>i===quarter?!x:x))}>{completed[quarter]?"✓ Marked complete":"Save quarter evidence"}</button></aside></article></section>
 <section><div className="rightsHeading"><p className="eyebrow">PRACTICE BEFORE PRESSURE</p><h2>Choose the safest, clearest response</h2><p>These are learning scenarios, not instructions for every situation.</p></div><div className="scenarioGrid">{scenarios.map((s,i)=><article key={s.title}><h3>{s.title}</h3><p>{s.prompt}</p>{s.choices.map((x,j)=><button key={x} className={answers[i]===j?(j===s.answer?"correct":"review"):""} onClick={()=>setAnswers({...answers,[i]:j})}>{x}</button>)}{answers[i]!==undefined&&<aside><b>{answers[i]===s.answer?"Strong choice":"Pause and review"}</b><span>{s.why}</span></aside>}</article>)}</div></section>
 <section className="rightsScripts"><div><p className="eyebrow">WORDS TO PRACTICE</p><h2>Calm scripts create clarity</h2></div><div>{["Am I free to leave?","I do not consent to a search.","I am going to remain calm. I do not want to answer questions without a parent, trusted adult, or lawyer.","May I have your name, badge number, and business card?"].map(x=><button key={x} onClick={()=>speak(x)}>🔊 “{x}”</button>)}</div></section>
 <section className="rightsRecord"><div><p className="eyebrow">DOCUMENT FACTS, NOT GUESSES</p><h2>Practice an incident record</h2><p>Record date, time, location, exact words you remember, names or badge numbers, witnesses, and what happened next. Do not post private information publicly.</p></div><label><b>My factual practice record</b><textarea value={reflection} onChange={e=>setReflection(e.target.value)} placeholder="On [date/time] at [place], I observed… The exact words I remember are… A witness was… My safe next step is…"/></label></section>
 <section className="trustedRights"><div><p className="eyebrow">OFFICIAL & TRUSTED STARTING POINTS</p><h2>Know where to verify and ask for help</h2></div><div>{links.map(x=><a href={x[1]} target="_blank" rel="noopener noreferrer" key={x[0]}>{x[0]} ↗</a>)}</div></section></div></section>
}
