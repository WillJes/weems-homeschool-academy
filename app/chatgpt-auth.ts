import {auth,createClerkClient} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";

export type ChatGPTUser = {displayName:string;email:string;fullName:string|null};
const SIGN_IN_PATH = "/sign-in";
const SIGN_OUT_PATH = "/sign-out";

export async function getChatGPTUser(): Promise<ChatGPTUser|null> {
  try {
    const {userId,sessionClaims}=await auth();
    if(!userId)return null;
    // Prefer the email already carried by Clerk's signed session. This avoids
    // making the portal depend on a second Clerk API request after sign-in.
    const claims=sessionClaims as Record<string,unknown>|null;
    const claimEmail=[claims?.email,claims?.email_address,claims?.primary_email_address]
      .find(value=>typeof value==="string"&&value.includes("@")) as string|undefined;
    const claimName=[claims?.name,claims?.full_name]
      .find(value=>typeof value==="string"&&value.trim()) as string|undefined;
    if(claimEmail)return {displayName:claimName??claimEmail,email:claimEmail,fullName:claimName??null};
    const secretKey=process.env.CLERK_SECRET_KEY??process.env.Weems_Rosenduft_Academy_CLERK_SECRET_KEY;
    if(!secretKey){
      console.error("[academy-auth] Clerk secret key is not configured");
      return null;
    }
    const user=await createClerkClient({secretKey}).users.getUser(userId);
    const primary=user.emailAddresses.find(address=>address.id===user.primaryEmailAddressId);
    const email=primary?.emailAddress??user.emailAddresses[0]?.emailAddress;
    if(!email)return null;
    const fullName=[user.firstName,user.lastName].filter(Boolean).join(" ")||null;
    return {displayName:fullName??email,email,fullName};
  } catch(error) {
    // Treat an expired or mismatched Clerk session as signed out. This keeps
    // every portal usable while still failing closed for protected content.
    console.error("[academy-auth] Unable to resolve signed-in user",error);
    return null;
  }
}

export async function requireChatGPTUser(returnTo:string):Promise<ChatGPTUser>{const user=await getChatGPTUser();if(user)return user;redirect(chatGPTSignInPath(returnTo))}
export function chatGPTSignInPath(returnTo:string):string{return `${SIGN_IN_PATH}?redirect_url=${encodeURIComponent(safeRelativeReturnPath(returnTo))}`}
export function chatGPTSignOutPath(returnTo="/"):string{return `${SIGN_OUT_PATH}?redirect_url=${encodeURIComponent(safeRelativeReturnPath(returnTo))}`}
function safeRelativeReturnPath(value:string):string{if(!value.startsWith("/")||value.startsWith("//"))return "/";try{const url=new URL(value,"https://app.local");if(url.origin!=="https://app.local")return "/";if(url.pathname===SIGN_IN_PATH||url.pathname===SIGN_OUT_PATH)return "/";return `${url.pathname}${url.search}${url.hash}`}catch{return "/"}}
