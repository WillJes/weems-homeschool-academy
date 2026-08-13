import {getChatGPTUser,chatGPTSignInPath} from "../../chatgpt-auth";
import {ProgressCenter} from "./progress";
import "./progress.css";
export const dynamic="force-dynamic";const ADMIN="weemsjestina@gmail.com";
export default async function ProgressPage(){const user=await getChatGPTUser();if(!user)return <main className="adminGate"><section><b>WR</b><h1>Progress & Reports</h1><p>Sign in with the approved administrator account.</p><a href={chatGPTSignInPath("/admin/progress")}>Sign in with ChatGPT</a></section></main>;if(user.email.toLowerCase()!==ADMIN)return <main className="adminGate"><section><b>🔒</b><h1>Access not authorized</h1><a href="/">Return home</a></section></main>;return <><nav className="adminTools"><a href="/admin">Records</a><a className="current" href="/admin/progress">Progress & Reports</a><a href="/admin/portfolio">Portfolio</a><a href="/">School Homepage</a></nav><ProgressCenter/></>}
