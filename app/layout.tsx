import type { Metadata } from "next";
import {ClerkProvider} from "@clerk/nextjs";
import "./globals.css";
import "./week.css";
export const metadata: Metadata = {title:"Weems-Rosenduft Academy",description:"The Weems-Rosenduft Academy family learning command center and interactive 90-day plan.",other:{"codex-preview":"development"}};
const clerkPublishableKey=process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY??process.env.NEXT_PUBLIC_Weems_Rosenduft_Academy_CLERK_PUBLISHABLE_KEY;
export default function RootLayout({children}:{children:React.ReactNode}){return <ClerkProvider publishableKey={clerkPublishableKey}><html lang="en"><body>{children}</body></html></ClerkProvider>}
