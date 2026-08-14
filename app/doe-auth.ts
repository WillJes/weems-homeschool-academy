import crypto from "node:crypto";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {ADMIN_EMAIL,APPROVED_DOE_VIEWERS,normalizeEmail} from "./access-control";
const COOKIE="wr_doe_portal";
function accessPin(){return process.env.DOE_ACCESS_PIN}
function secret(){const pin=accessPin();return pin?crypto.createHash("sha256").update(`weems-doe:${pin}:${[ADMIN_EMAIL,...APPROVED_DOE_VIEWERS].join(":")}`).digest("hex"):null}
function safeEqual(a:string,b:string){const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&crypto.timingSafeEqual(x,y)}
function signature(email:string,expires:string,signingSecret:string){return crypto.createHmac("sha256",signingSecret).update(`${email}.${expires}`).digest("hex")}
export async function getDOESession(){const value=(await cookies()).get(COOKIE)?.value,signingSecret=secret();if(!value||!signingSecret)return null;const decoded=Buffer.from(value,"base64url").toString();const [email,expires,sig]=decoded.split("|");if(!email||!expires||!sig||Number(expires)<Date.now()||!safeEqual(sig,signature(email,expires,signingSecret)))return null;return email}
export async function doeLogin(formData:FormData){"use server";const email=normalizeEmail(String(formData.get("email")??"")),pin=String(formData.get("pin")??"").trim(),expectedPin=accessPin(),signingSecret=secret();if(!expectedPin||!signingSecret)redirect("/doe?error=setup");if(email!==ADMIN_EMAIL&&!APPROVED_DOE_VIEWERS.includes(email))redirect("/doe?error=email");if(!safeEqual(pin,expectedPin))redirect("/doe?error=pin");const expires=String(Date.now()+1000*60*60*12);const value=Buffer.from(`${email}|${expires}|${signature(email,expires,signingSecret)}`).toString("base64url");(await cookies()).set(COOKIE,value,{httpOnly:true,secure:true,sameSite:"lax",path:"/",maxAge:60*60*12});redirect("/doe")}
export async function doeLogout(){"use server";(await cookies()).delete(COOKIE);redirect("/doe")}
