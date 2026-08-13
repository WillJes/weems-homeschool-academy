import {SignIn} from "@clerk/nextjs";
import {getChatGPTUser} from "../chatgpt-auth";
import {InstructorProfile} from "./profile";

export const dynamic="force-dynamic";
const ADMIN="weemsjestina@gmail.com";

export default async function InstructorPage(){
 const user=await getChatGPTUser();
 if(!user)return <main className="instructorGate"><section><b className="gateMark">WR</b><small>WEEMS-ROSENDUFT ACADEMY</small><h1>Instructor Portal</h1><p>Approved family instructors can sign in, create their own teaching profile and enter the shared Academy workspace.</p><SignIn routing="hash"/><a href="/">← Return to public homepage</a></section></main>;
 return <InstructorProfile email={user.email} initialName={user.displayName} isAdmin={user.email.toLowerCase()===ADMIN}/>;
}
