"use client";
import {useState} from "react";

export function SmartResponse({value,onChange,placeholder="Write in your own words…",mode="analyze"}:{value:string;onChange:(v:string)=>void;placeholder?:string;mode?:"explain"|"analyze"|"compare"|"argue"}){
 const [open,setOpen]=useState(false);
 const tidy=(v:string)=>{let x=v.trim().replace(/\s+/g," ").replace(/\bi\b/g,"I").replace(/\bcant\b/gi,"can't").replace(/\bdont\b/gi,"don't").replace(/\bwont\b/gi,"won't").replace(/\ba lot of\b/gi,"many");if(x)x=x[0].toUpperCase()+x.slice(1);if(x&&!/[.!?]$/.test(x))x+=".";return x};
 const prompts={explain:["The main idea is…","For example…","This means…"],analyze:["The evidence suggests…","This matters because…","A connection I notice is…"],compare:["Both examples show…","However, they differ because…","The stronger evidence is…"],argue:["I argue that…","One piece of evidence is…","This supports my claim because…"]}[mode];
 const listen=()=>{const w=window as any,R=w.SpeechRecognition||w.webkitSpeechRecognition;if(!R)return alert("Talk-to-text is unavailable in this browser.");const r=new R();r.lang="en-US";r.onresult=(e:any)=>onChange(`${value}${value?" ":""}${e.results[0][0].transcript}`);r.start()};
 const speak=()=>{if(!value||!("speechSynthesis" in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(value);u.rate=.88;window.speechSynthesis.speak(u)};
 return <div className="smartResponse"><textarea value={value} onChange={e=>{onChange(e.target.value);setOpen(false)}} placeholder={placeholder}/><div className="smartTools"><button type="button" onClick={listen}>🎙 Talk</button><button type="button" onClick={speak}>🔊 Hear mine</button><button type="button" disabled={!value.trim()} onClick={()=>setOpen(!open)}>✓ Review my answer</button></div>{open&&<div className="smartFeedback"><p><b>Corrected structure:</b> {tidy(value)}</p><div><b>Make it stronger:</b>{prompts.map(p=><button type="button" key={p} onClick={()=>{onChange(`${tidy(value)} ${p} `);setOpen(false)}}>{p}</button>)}</div><small>Check that you answered the whole question, included specific evidence, and explained why the evidence matters.</small></div>}</div>
}
