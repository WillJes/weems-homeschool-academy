import type {NextFetchEvent,NextRequest} from "next/server";

export default async function proxy(request:NextRequest,event:NextFetchEvent){
  process.env.CLERK_SECRET_KEY??=process.env.Weems_Rosenduft_Academy_CLERK_SECRET_KEY;
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY??=process.env.NEXT_PUBLIC_Weems_Rosenduft_Academy_CLERK_PUBLISHABLE_KEY;
  const {clerkMiddleware}=await import("@clerk/nextjs/server");
  const protectedApi=request.nextUrl.pathname.startsWith("/api/admin-records")||request.nextUrl.pathname.startsWith("/api/portfolio");
  const middleware=clerkMiddleware(async auth=>{if(protectedApi)await auth.protect()});
  return middleware(request,event);
}

export const config={matcher:["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)","/(api|trpc)(.*)"]};
