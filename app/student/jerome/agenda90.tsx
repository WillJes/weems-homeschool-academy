"use client";
import {useEffect,useState} from "react";
import {JeromeQuarterRhythm} from "./quarter-rhythm";
const plan=[
 ["Strong Starts & Family Systems","Learning autobiography • baseline math • 3–9 executive plan","Family routine map + measurable goal card","English • Math • Executive Function","🧭"],
 ["Identity, Voice & Our Stories","Personal narrative • primary sources • recorded introduction","Digital identity story","English • Media • History","🎙️"],
 ["Maps, Community & Belonging","Community research • spatial thinking • civic resources","Brooklyn community resource analysis","Geography • Data • Writing","🗺️"],
 ["Safety, Preparedness & First Response","Fire safety • home systems • emergency communication","Family safety binder + drill leadership","Safety • Careers • Health","🚒"],
 ["Living Things & Ecosystems","Scientific reading • field data • ecosystem analysis","Mini ecosystem investigation","Biology • Data • Writing","🌱"],
 ["Forces, Motion & Building","Measurement • mechanics • CAD thinking","Build-test-improve engineering challenge","Physics • Math • Trades","🧱"],
 ["Money, Choices & Financial Literacy","Budgeting • banking • comparison • beginner investing","Family mini-budget + savings pitch","Finance • Math • Speaking","💵"],
 ["Media, Film & Digital Storytelling","Grip department • lighting • audio • editing","Grip gear map + one-minute family documentary","Media • Writing • Technology • Career","🎬"],
 ["Civics, Government & Our Rights","Government • advocacy • primary sources • debate","Mock council + issue letter","Civics • Debate • English","⚖️"],
 ["Healthy Bodies, Minds & Emotions","Body systems • hygiene • regulation • self-advocacy","Personal wellness and regulation plan","Health • SEL • Science","🧠"],
 ["Food, Culture & Kitchen Science","Fractions • chemistry • cultural geography • safety","Plan and prepare a family meal","Chemistry • Math • Life Skills","🥣"],
 ["Weather, Climate & Earth Systems","Weather data • water systems • climate","Five-day forecast and analysis","Earth Science • Data • Media","🌦️"],
 ["Black History, Justice & Changemakers","Biography • primary sources • justice","Changemaker presentation","History • English • Justice","✊🏽"],
 ["Technology, Coding & Cyber Safety","AI literacy • privacy • scams • source checking","Family AI project + interactive safety lesson","Coding • Cybersecurity • Media Literacy","💻"],
 ["Careers, Trades & Public Service","Grip and gear rental • firefighting • CAD • coding","Ethan interview + career and business comparison","Careers • Research • Speaking","🛠️"],
 ["Entrepreneurship & Creative Independence","Product • pricing • marketing • budget","Pop-up business plan + sales pitch","Business • Finance • Media","🚀"],
 ["Leadership, Service & Community Impact","Teamwork • debate • service planning","Documented service action","Leadership • Service • SEL","🤝"],
 ["Showcase, Reflection & Next-Quarter Launch","Portfolio revision • assessments • new goals","90-day learning showcase","Portfolio • Reflection • Planning","🏆"]
];
export function Jerome90DayPlan({speak}:{speak:(x:string)=>void}){
 const[week,setWeek]=useState(1),[done,setDone]=useState<string[]>([]);
 useEffect(()=>{try{setDone(JSON.parse(localStorage.getItem("jerome90")||"[]"))}catch{}},[]);
 useEffect(()=>localStorage.setItem("jerome90",JSON.stringify(done)),[done]);
 const w=plan[week-1],skills=w[1].split(" • "),tasks=[["English / Voice",skills[0]],["Math / Data",skills[1]||"Quantitative reasoning"],["Career / Technology",skills[2]||w[3]],["Weekly Product",w[2]]];
 const toggle=(id:string)=>setDone(done.includes(id)?done.filter(x=>x!==id):[...done,id]);
 return <section className="agendaPage"><div className="agendaHero"><div><p className="eyebrow">WEEMS-ROSENDUFT ACADEMY • GRADE 10</p><h1>90 Days. One connected direction.</h1><p>The family theme stays shared. Your work is built for high school, independence, career exploration and portfolio evidence.</p><div className="agendaProgress"><i><b style={{width:`${done.length/72*100}%`}}/></i><span>{done.length} of 72 milestones complete</span></div></div><strong>90</strong></div><JeromeQuarterRhythm/><div className="agendaBody"><div className="agendaWeekNav">{plan.map((x,i)=><button className={week===i+1?"active":""} onClick={()=>setWeek(i+1)} key={x[0]}><b>{String(i+1).padStart(2,"0")}</b><span>{x[4]}</span><small>{x[0]}</small></button>)}</div><section className="agendaFocus"><div className="agendaFocusHead"><span>{w[4]}</span><div><p className="eyebrow">WEEK {week} • DAYS {(week-1)*5+1}–{week*5}</p><h2>{w[0]}</h2><p>{w[3]}</p></div><button onClick={()=>speak(`Week ${week}. ${w[0]}. Your work: ${w[1]}. Weekly product: ${w[2]}.`)}>🔊 Listen</button></div><div className="agendaMilestones">{tasks.map((t,i)=>{const id=`w${week}-${i}`;return <button className={done.includes(id)?"done":""} onClick={()=>toggle(id)} key={t[0]}><span>{done.includes(id)?"✓":i+1}</span><div><small>{t[0]}</small><b>{t[1]}</b></div></button>})}</div><div className="weekFlow">{[["MON","Launch + baseline"],["TUE","Skill + build"],["WED","Collaborate + analyze"],["THU","Apply + revise"],["FRI","Present + document"]].map(x=><div key={x[0]}><b>{x[0]}</b><span>{x[1]}</span></div>)}</div><aside><div><small>FINISH LINE</small><h3>{w[2]}</h3></div><a href="/workspace" target="_blank" rel="noreferrer">Instructor agenda ↗</a></aside></section></div></section>
}
