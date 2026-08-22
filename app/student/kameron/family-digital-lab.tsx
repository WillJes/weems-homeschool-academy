"use client";

import {useState} from "react";

const projects=[
  ["📦","Cardboard Creator","Ask AI for three things a box could become. Pick one, draw it, build it, test it, and make it better."],
  ["🧱","Brick Story Studio","Ask AI for a five-part story idea. Build the scenes with bricks, then tell the story in your own words."],
  ["🧴","Recycled Inventor","With an adult, choose clean containers. Ask AI for safe invention ideas, then check every step before making."],
  ["🎵","Home Music Maker","List safe household objects. Ask AI how to sort their sounds, then create and perform a four-beat pattern."]
];

export function FamilyDigitalLab({speak,record}:{speak:(text:string)=>void;record:(eventType:string,skill:string,activity:string,result?:string,minutes?:number)=>unknown}){
  const [open,setOpen]=useState(0);
  const [done,setDone]=useState<string[]>([]);
  const safety=["I keep my full name, address, password, schedule, and private photos private.","I stop and get an adult before clicking links, downloads, prizes, or scary messages.","I know AI can make mistakes, so I check important answers.","I use AI to help me think—not to be mean, pretend to be someone else, or do all my work."];
  const finish=(name:string)=>{setDone(x=>x.includes(name)?x:[...x,name]);record("family_digital","internet safety and AI",name,"completed",20);speak(`${name} complete. You used technology safely and added your own ideas.`)};
  return <section className="familyDigitalKid readable" id="family-digital-lab"><div className="familyDigitalKidHead"><small>GROUP CLASS · LEARN TOGETHER</small><h2>Internet Safety + AI Idea Lab</h2><p>Dodger’s rule: protect first, check second, create third. AI can help us imagine—but people make the choices.</p><button onClick={()=>speak("Protect first. Check second. Create third. Keep private information private, ask an adult before clicking, and check AI answers.")}>🔊 Hear Dodger’s rules</button></div><div className="familySafetyCards">{safety.map((rule,i)=><article key={rule}><span>{["🔒","✋","🔎","🧠"][i]}</span><p>{rule}</p></article>)}</div><div className="kidAiRoutine"><h3>Ask → Check → Make → Tell</h3><ol><li><b>Ask:</b> Tell AI your goal, age, materials, and safety rules.</li><li><b>Check:</b> Read it with an adult. Look for mistakes or unsafe steps.</li><li><b>Make:</b> Use your hands, ideas, and things you already have.</li><li><b>Tell:</b> Explain what you changed and what you learned.</li></ol></div><div className="homeProjectTabs">{projects.map((p,i)=><button className={open===i?"active":""} key={p[1]} onClick={()=>{setOpen(i);speak(`${p[1]}. ${p[2]}`)}}><span>{p[0]}</span><b>{p[1]}</b></button>)}</div><article className="homeProject"><span>{projects[open][0]}</span><div><small>BUILD WITH WHAT WE HAVE</small><h3>{projects[open][1]}</h3><p>{projects[open][2]}</p><button onClick={()=>finish(projects[open][1])}>{done.includes(projects[open][1])?"✓ Project complete":"I made it!"}</button></div></article><aside><strong>Family scam practice:</strong> A message says, “Send your password now or lose your game.” Say: “Stop. I do not share passwords. I will ask my adult and open the official app myself.”</aside></section>
}
