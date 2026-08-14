import crypto from "node:crypto";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {ADMIN_EMAIL,APPROVED_INSTRUCTORS,normalizeEmail} from "./access-control";

export const instructors={
 jestina:{name:"Jestina Weems-Rosenduft",email:ADMIN_EMAIL,role:"Administrator & Lead Instructor"},
 denise:{name:"Denise Gordon (Nana)",email:APPROVED_INSTRUCTORS[0],role:"History, Geography, Film & Writing"},
 mona:{name:"Mona Rosenduft",email:APPROVED_INSTRUCTORS[1],role:"Art, STEM & Hands-on Labs"},
 david:{name:"David Rosenduft",email:APPROVED_INSTRUCTORS[2],role:"Safety, Robotics & Life Skills"}
} as const;
export type InstructorKey=keyof typeof instructors;
const COOKIE="wr_instructor_portal";
function accessPin(){return process.env.INSTRUCTOR_ACCESS_PIN}
function secret(){const pin=accessPin();return pin?crypto.createHash("sha256").update(`weems-instructor:${pin}:${Object.values(instructors).map(x=>x.email).join(":")}`).digest("hex"):null}
function signature(key:InstructorKey,expires:string,signingSecret:string){return crypto.createHmac("sha256",signingSecret).update(`${key}.${expires}`).digest("hex")}
function safeEqual(a:string,b:string){const left=Buffer.from(a),right=Buffer.from(b);return left.length===right.length&&crypto.timingSafeEqual(left,right)}
export async function getInstructorSession():Promise<{key:InstructorKey;name:string;email:string;role:string}|null>{const value=(await cookies()).get(COOKIE)?.value,signingSecret=secret();if(!value||!signingSecret)return null;const [key,expires,sig]=value.split(".") as [InstructorKey,string,string];if(!instructors[key]||!expires||!sig||Number(expires)<Date.now()||!safeEqual(sig,signature(key,expires,signingSecret)))return null;return {key,...instructors[key]}}
export async function instructorLogin(formData:FormData){"use server";const key=String(formData.get("instructor")??"") as InstructorKey;const email=normalizeEmail(String(formData.get("email")??"")),pin=String(formData.get("pin")??"").trim(),expectedPin=accessPin(),signingSecret=secret();if(!instructors[key])redirect("/instructor?error=instructor");if(!expectedPin||!signingSecret)redirect("/instructor?error=setup");if(email!==normalizeEmail(instructors[key].email))redirect(`/instructor?error=email&instructor=${key}`);if(!safeEqual(pin,expectedPin))redirect(`/instructor?error=pin&instructor=${key}`);const expires=String(Date.now()+1000*60*60*12);(await cookies()).set(COOKIE,`${key}.${expires}.${signature(key,expires,signingSecret)}`,{httpOnly:true,secure:true,sameSite:"lax",path:"/",maxAge:60*60*12});redirect("/instructor")}
export async function instructorLogout(){"use server";(await cookies()).delete(COOKIE);redirect("/instructor")}
