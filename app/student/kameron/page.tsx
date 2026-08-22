import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getChatGPTUser } from "../../chatgpt-auth";
import { isAdministrator } from "../../access-control";
import { hasStudentSession } from "../student-session";
import LearningWorld from "./learning-world";

export const dynamic = "force-dynamic";

export default async function KameronLearningPage() {
  const user = await getChatGPTUser();
  const studentCookie = (await cookies()).get("wr_student_portal")?.value;
  const isAdmin = Boolean(user && isAdministrator(user.email));
  const allowed = isAdmin || hasStudentSession(studentCookie, "kameron");
  if (!allowed) redirect("/student?error=student");
  return <LearningWorld allowParentMode={isAdmin} />;
}
