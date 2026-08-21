import type { Metadata, Viewport } from "next";
import {ClerkProvider} from "@clerk/nextjs";
import {GradeSpanBanner} from "./grade-span-banner";
import {MobileBackButton} from "./mobile-back-button";
import "./globals.css";
import "./week.css";

export const metadata: Metadata = {
  title:"Weems-Rosenduft Academy",
  description:"The Weems-Rosenduft Academy family learning command center and interactive 90-day plan.",
  manifest:"/manifest.webmanifest",
  appleWebApp:{capable:true,title:"WRA",statusBarStyle:"default"},
  icons:{
    icon:[{url:"/branding/weems-rosenduft-academy-logo.jpg",type:"image/jpeg"}],
    apple:[{url:"/branding/weems-rosenduft-academy-logo.jpg",type:"image/jpeg"}],
  },
};

export const viewport: Viewport = {themeColor:"#5b2c83"};

const clerkPublishableKey=process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY??process.env.NEXT_PUBLIC_Weems_Rosenduft_Academy_CLERK_PUBLISHABLE_KEY;
export default function RootLayout({children}:{children:React.ReactNode}){return <ClerkProvider publishableKey={clerkPublishableKey}><html lang="en"><body><GradeSpanBanner/><MobileBackButton/>{children}</body></html></ClerkProvider>}
