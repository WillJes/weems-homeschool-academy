import {clerkMiddleware,createRouteMatcher} from "@clerk/nextjs/server";
const isProtectedApi=createRouteMatcher(["/api/admin-records(.*)","/api/portfolio(.*)"]);
const publishableKey=process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY??process.env.NEXT_PUBLIC_Weems_Rosenduft_Academy_CLERK_PUBLISHABLE_KEY;
export default clerkMiddleware(async(auth,request)=>{if(isProtectedApi(request))await auth.protect()},{publishableKey});
export const config={matcher:["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)","/(api|trpc)(.*)"]};
