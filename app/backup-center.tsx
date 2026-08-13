"use client";

import {ChangeEvent, useEffect, useMemo, useState} from "react";

const FORMAT = "weems-academy-backup-v1";
const ITEMS = [
  {key:"weems-attendance-hours",label:"Attendance & instructional hours",icon:"◷"},
  {key:"academy-reminders",label:"Assignments & reminders",icon:"◴"},
  {key:"academy-reminder-settings",label:"Reminder settings",icon:"⚙"},
  {key:"academy-reminder-log",label:"Reminder history",icon:"✓"},
  {key:"weemsNotes",label:"Instructor lesson notes",icon:"✎"},
  {key:"weemsDone",label:"Daily completion",icon:"●"},
  {key:"weemsWeek1",label:"Weekly lesson completion",icon:"▦"},
  {key:"weems-lab-records",label:"Lab records",icon:"⚗"},
  {key:"full-year-lab-plan",label:"Full-year lab plan",icon:"▣"},
  {key:"weems-lab-submissions",label:"Student lab submissions",icon:"↥"},
  {key:"stem-kit-status",label:"STEM kit inventory status",icon:"▤"},
  {key:"stem-extra-kits",label:"Added STEM kits",icon:"＋"},
  {key:"standards-credit-records",label:"Standards & credit records",icon:"◎"},
  {key:"weems-book-library",label:"Family book library",icon:"▥"},
  {key:"academy-report-card-drafts",label:"Report card drafts",icon:"▧"},
  {key:"academy-transcript-courses",label:"Transcript courses",icon:"▥"},
  {key:"academy-compliance-checklist",label:"Compliance checklist",icon:"✓"},
] as const;

type AcademyBackup={format:string;school:string;createdAt:string;data:Record<string,unknown>};
type Audit={action:string;date:string;items:number};

const readValue=(key:string)=>{const raw=localStorage.getItem(key);if(raw===null)return undefined;try{return JSON.parse(raw)}catch{return raw}};
const download=(value:unknown,name:string)=>{const blob=new Blob([JSON.stringify(value,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=name;a.click();URL.revokeObjectURL(url)};
const stamp=()=>new Date().toISOString().slice(0,10);

export function BackupCenter(){
 const[available,setAvailable]=useState<string[]>([]),[incoming,setIncoming]=useState<AcademyBackup|null>(null),[selected,setSelected]=useState<string[]>([]),[confirm,setConfirm]=useState(""),[message,setMessage]=useState(""),[audit,setAudit]=useState<Audit[]>([]);
 const scan=()=>setAvailable(ITEMS.filter(x=>localStorage.getItem(x.key)!==null).map(x=>x.key));
 useEffect(()=>{scan();try{setAudit(JSON.parse(localStorage.getItem("academy-backup-log")||"[]"))}catch{}},[]);
 const addAudit=(action:string,items:number)=>{const next=[{action,date:new Date().toISOString(),items},...audit].slice(0,12);setAudit(next);localStorage.setItem("academy-backup-log",JSON.stringify(next))};
 const exportBackup=()=>{const data:Record<string,unknown>={};ITEMS.forEach(x=>{const value=readValue(x.key);if(value!==undefined)data[x.key]=value});const backup:AcademyBackup={format:FORMAT,school:"Weems-Rosenduft Academy",createdAt:new Date().toISOString(),data};download(backup,`weems-academy-backup-${stamp()}.json`);addAudit("Backup downloaded",Object.keys(data).length);setMessage("Backup downloaded. Keep the file in a safe family folder.")};
 const loadFile=async(e:ChangeEvent<HTMLInputElement>)=>{setMessage("");setIncoming(null);setConfirm("");try{const file=e.target.files?.[0];if(!file)return;const parsed=JSON.parse(await file.text()) as AcademyBackup;if(parsed.format!==FORMAT||!parsed.data||typeof parsed.data!=="object")throw new Error();const clean:Record<string,unknown>={};ITEMS.forEach(x=>{if(Object.prototype.hasOwnProperty.call(parsed.data,x.key))clean[x.key]=parsed.data[x.key]});if(!Object.keys(clean).length)throw new Error();setIncoming({...parsed,data:clean});setSelected(Object.keys(clean));setMessage("Backup verified. Review the categories below before restoring.")}catch{setMessage("This file is not a verified Weems Academy backup.")}};
 const restore=()=>{if(!incoming||confirm.trim().toUpperCase()!=="RESTORE"||!selected.length)return;const current:Record<string,unknown>={};ITEMS.forEach(x=>{const value=readValue(x.key);if(value!==undefined)current[x.key]=value});localStorage.setItem("academy-pre-restore-snapshot",JSON.stringify({format:FORMAT,school:"Weems-Rosenduft Academy",createdAt:new Date().toISOString(),data:current}));selected.forEach(key=>localStorage.setItem(key,JSON.stringify(incoming.data[key])));addAudit("Backup restored",selected.length);setMessage("Restore complete. Refreshing the Academy with the restored records…");setTimeout(()=>location.reload(),900)};
 const incomingItems=useMemo(()=>ITEMS.filter(x=>incoming?.data&&Object.prototype.hasOwnProperty.call(incoming.data,x.key)),[incoming]);
 return <div className="page backupPage">
  <section className="backupHero"><div><small>SCHOOL-YEAR PROTECTION</small><h2>Backup & Transfer Center</h2><p>Carry the Academy’s device-saved learning records safely to another computer—or keep a dated copy for your files.</p></div><strong>☁︎</strong></section>
  <div className="backupNotice"><b>Privacy-first transfer</b><span>This backup includes Academy records only. It never includes passwords, sign-in access, email credentials or private site keys.</span></div>
  <div className="backupGrid">
   <section className="backupCard"><span className="step">1</span><small>DOWNLOAD A COPY</small><h3>Create this device’s backup</h3><p>{available.length} record {available.length===1?"category":"categories"} found on this device.</p><div className="backupContents">{ITEMS.map(x=><span className={available.includes(x.key)?"has":""} key={x.key}><i>{available.includes(x.key)?"✓":x.icon}</i>{x.label}</span>)}</div><button className="backupPrimary" onClick={exportBackup} disabled={!available.length}>Download Academy backup</button><small className="help">Recommended: once each month and at the end of every quarter.</small></section>
   <section className="backupCard"><span className="step">2</span><small>MOVE OR RECOVER RECORDS</small><h3>Restore a verified backup</h3><p>Choose a backup file from this Academy. Nothing changes until you review and confirm.</p><label className="filePick">Choose backup file<input type="file" accept="application/json,.json" onChange={loadFile}/></label>{incoming&&<div className="restoreReview"><b>Verified backup</b><small>Created {new Date(incoming.createdAt).toLocaleString()} • {incomingItems.length} categories</small>{incomingItems.map(x=><label key={x.key}><input type="checkbox" checked={selected.includes(x.key)} onChange={()=>setSelected(selected.includes(x.key)?selected.filter(k=>k!==x.key):[...selected,x.key])}/><span>{x.icon} {x.label}</span></label>)}<label className="confirm">Type <b>RESTORE</b> to confirm<input value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="RESTORE"/></label><button className="restoreButton" onClick={restore} disabled={confirm.trim().toUpperCase()!=="RESTORE"||!selected.length}>Restore {selected.length} selected categories</button><small className="help">A safety snapshot of the current device is saved before replacement.</small></div>}</section>
  </div>
  {message&&<div className="backupMessage" role="status">{message}</div>}
  <div className="backupBottom"><section><small>WHAT STAYS ONLINE</small><h3>Protected school records remain separate</h3><p>Administrator records and portfolio submissions already stored in the protected Academy system are not overwritten by a device restore. This center covers the progress saved locally in this browser.</p></section><section><small>TRANSFER LOG</small><h3>Recent activity</h3>{audit.length?<div className="auditList">{audit.slice(0,5).map((x,i)=><p key={i}><b>{x.action}</b><span>{x.items} categories • {new Date(x.date).toLocaleString()}</span></p>)}</div>:<p>No backups or restores recorded on this device yet.</p>}</section></div>
 </div>
}
