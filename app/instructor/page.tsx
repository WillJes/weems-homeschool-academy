import {SignIn} from "@clerk/nextjs";
import {getChatGPTUser} from "../chatgpt-auth";
import {InstructorProfile} from "./profile";
import {isAdministrator,isApprovedInstructor} from "../access-control";

export const dynamic="force-dynamic";
export default async function InstructorPage(){
 const user=await getChatGPTUser();
 if(!user)return <main className="instructorGate"><section><img className="workspaceGateLogo" src="/branding/weems-rosenduft-academy-logo.jpg" alt="Weems-Rosenduft Academy"/><small>APPROVED INSTRUCTORS</small><h1>Instructor Portal</h1><p>Sign in with the approved Google account or email address assigned to you. After sign-in, you will return directly to your private instructor dashboard.</p><SignIn routing="hash" forceRedirectUrl="/instructor" signUpForceRedirectUrl="/instructor"/><a href="/">← Return to public homepage</a></section></main>;
 if(!isApprovedInstructor(user.email))return <main className="instructorGate"><section><img className="workspaceGateLogo" src="/branding/weems-rosenduft-academy-logo.jpg" alt="Academy logo"/><small>INSTRUCTOR ACCESS</small><h1>Approval required</h1><p><strong>{user.email}</strong> is signed in, but this address is not on the approved Academy instructor list. Contact the administrator before continuing.</p><a href="/">← Return to the Academy homepage</a></section></main>;
 return <InstructorProfile email={user.email} initialName={user.displayName} isAdmin={isAdministrator(user.email)}/>;
}
