import type { Metadata } from "next";
import "./globals.css";
import "./week.css";
export const metadata: Metadata = {title:"Weems-Rosenduft Academy",description:"The Weems-Rosenduft Academy family learning command center and interactive 90-day plan.",other:{"codex-preview":"development"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
