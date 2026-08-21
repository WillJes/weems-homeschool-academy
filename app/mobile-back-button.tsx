"use client";
import {usePathname,useRouter} from "next/navigation";

export function MobileBackButton(){
 const router=useRouter(),pathname=usePathname();
 const goBack=()=>{if(window.history.length>1)router.back();else router.push("/")};
 return <button type="button" className="mobileBackButton" onClick={goBack} aria-label="Go back"><span aria-hidden="true">←</span><b>Back</b>{pathname!=="/"&&<small>Home if needed</small>}</button>;
}
