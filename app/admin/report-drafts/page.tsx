import {getChatGPTUser,chatGPTSignInPath} from "../../chatgpt-auth";
import {ReportDrafts} from "./drafts";
import "./drafts.css";
export const dynamic="force-dynamic";const ADMIN="weemsjestina@gmail.com";
export default async function DraftPage(){const user=await getChatGPTUser();if(!user)return <main className="adminGate"><section><b>WR</b><h1>Report Drafts</h1><p>Sign in with the approved administrator account.</p><a href={chatGPTSignInPath("/admin/report-drafts")}>Sign in with ChatGPT</a></section></main>;if(user.email.toLowerCase()!==ADMIN)return <main className="adminGate"><section><b>🔒</b><h1>Access not authorized</h1><a href="/">Return home</a></section></main>;return <><nav className="adminTools"><a href="/admin">Records</a><a href="/admin/progress">Progress</a><a href="/admin/portfolio">Portfolio</a><a href="/admin/approvals">Approvals</a><a className="current" href="/admin/report-drafts">Report Drafts</a></nav><ReportDrafts/></>}
