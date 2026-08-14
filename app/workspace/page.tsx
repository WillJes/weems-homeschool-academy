import {SignIn} from "@clerk/nextjs";
import {getChatGPTUser} from "../chatgpt-auth";
import AcademyWorkspace from "../page";
import {isApprovedInstructor} from "../access-control";

export const dynamic="force-dynamic";
export default async function WorkspacePage(){
 const user=await getChatGPTUser();
 if(!user)return <main className="instructorGate"><section><img className="workspaceGateLogo" src="/branding/weems-rosenduft-academy-logo.jpg" alt="Weems-Rosenduft Academy"/><small>PRIVATE ACADEMY WORKSPACE</small><h1>Sign in to continue</h1><p>The working dashboard contains student schedules, progress and instructor tools. It is not part of the public tour.</p><SignIn routing="hash" forceRedirectUrl="/workspace" signUpForceRedirectUrl="/workspace"/><a href="/tour">← Return to the public Academy tour</a></section></main>;
 if(!isApprovedInstructor(user.email))return <main className="instructorGate"><section><img className="workspaceGateLogo" src="/branding/weems-rosenduft-academy-logo.jpg" alt="Academy logo"/><small>PRIVATE ACADEMY WORKSPACE</small><h1>Instructor approval required</h1><p>This signed-in email is not approved for the shared instructional workspace.</p><a href="/">← Return to the Academy homepage</a></section></main>;
 return <AcademyWorkspace workspace/>;
}
