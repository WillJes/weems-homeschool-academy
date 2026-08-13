import {SignIn} from "@clerk/nextjs";
import {getChatGPTUser} from "../chatgpt-auth";
import AcademyWorkspace from "../page";

export const dynamic="force-dynamic";
export default async function WorkspacePage(){
 const user=await getChatGPTUser();
 if(!user)return <main className="instructorGate"><section><img className="workspaceGateLogo" src="/branding/weems-rosenduft-academy-logo.jpg" alt="Weems-Rosenduft Academy"/><small>PRIVATE ACADEMY WORKSPACE</small><h1>Sign in to continue</h1><p>The working dashboard contains student schedules, progress and instructor tools. It is not part of the public tour.</p><SignIn routing="hash"/><a href="/tour">← Return to the public Academy tour</a></section></main>;
 return <AcademyWorkspace workspace/>;
}
