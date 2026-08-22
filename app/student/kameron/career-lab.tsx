"use client";

import {useState} from "react";

const careers = [
  {
    icon:"🎥", title:"Film Grip Helper", badge:"Learn from Ethan",
    intro:"Grips help a film crew move cameras and shape light safely. Kameron can learn the words, teamwork, counting, and planning without touching dangerous gear.",
    skills:["Match a picture of safe, lightweight gear to its name","Count and label items on a pretend checkout sheet","Draw where a light, camera, and actor go","Practice the safety words: Stop. Step back. Ask an adult."],
    mission:"Make a mini movie set with blocks. Add a camera spot, an actor spot, and two cardboard flags. Tell what each part does.",
    safety:"Kid rule: no heavy gear, ladders, overhead rigging, electrical equipment, production vehicles, or real set work without Ethan or another qualified adult."
  },
  {
    icon:"🏗️", title:"Master Builder", badge:"Plan • Build • Test",
    intro:"Master builders turn ideas into strong, useful creations. They plan first, measure, build, test, improve, and explain their choices.",
    skills:["Sketch an idea before building","Measure with blocks, a ruler, or a tape with an adult","Build a strong base and test what it can hold","Change one part, test again, and explain the improvement"],
    mission:"Build a bridge for one toy. Test it with 1, 2, then 3 small objects. Draw the strongest version and circle what made it work.",
    safety:"Kid rule: use classroom building materials. An adult handles sharp tools, power tools, hot glue, and heavy materials."
  },
  {
    icon:"🤖", title:"Robotics", badge:"Build • Code • Debug",
    intro:"Robotics combines building, movement, sensors, and code. Roboticists make a plan, give precise instructions, test, and fix one problem at a time.",
    skills:["Create a step-by-step command sequence","Predict what a robot will do before pressing start","Use a sensor or button in a beginner kit","Find one bug, change one thing, and test again"],
    mission:"Program a person-robot: write picture commands to move from START to a toy. Test the commands, find the bug, and improve the route.",
    safety:"Kid rule: use age-appropriate robotics kits with adult help. Keep motors and batteries away from water and stop if a part gets hot."
  }
];

export function CareerLab({speak,record}:{speak:(text:string)=>void;record:(eventType:string,skill:string,activity:string,result?:string,minutes?:number)=>unknown}){
  const [open,setOpen]=useState(0);
  const [done,setDone]=useState<string[]>([]);
  const career=careers[open];
  const complete=()=>{setDone(x=>x.includes(career.title)?x:[...x,career.title]);record("career_complete",career.title,career.mission,"completed",25);speak(`${career.title} mission complete. Great job planning, building, and learning safely!`)};
  return <section className="kidCareers readable" id="career-lab">
    <div className="kidCareerTitle"><small>FUTURE BUILDER LAB</small><h2>What could Kameron build someday?</h2><p>Try a real-world career in a safe, kid-sized mission. Every path uses planning, teamwork, creativity, and a strong “ask an adult” safety habit.</p></div>
    <div className="kidCareerTabs">{careers.map((item,index)=><button key={item.title} className={open===index?"active":""} onClick={()=>{setOpen(index);speak(`${item.title}. ${item.intro}`)}}><span>{item.icon}</span><b>{item.title}</b><small>{done.includes(item.title)?"✓ Mission complete":item.badge}</small></button>)}</div>
    <article className="kidCareerLesson">
      <div className="kidCareerIntro"><span>{career.icon}</span><div><small>{career.badge}</small><h3>{career.title}</h3><p>{career.intro}</p></div><button onClick={()=>speak(`${career.title}. ${career.intro}. ${career.safety}`)}>🔊 Hear it</button></div>
      <div className="kidCareerColumns"><section><h4>Skills to practice</h4><ul>{career.skills.map(skill=><li key={skill}>✓ {skill}</li>)}</ul></section><section className="kidMission"><h4>Try it today</h4><p>{career.mission}</p><button onClick={complete}>{done.includes(career.title)?"✓ Mission complete":"I finished my mission!"}</button></section></div>
      <aside><strong>🛟 Safety first:</strong> {career.safety}</aside>
    </article>
  </section>
}
