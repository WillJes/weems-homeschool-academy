import crypto from "node:crypto";

export type StudentKey = "jerome" | "kameron" | "marilyn";

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function sessionSecret() {
  if (process.env.STUDENT_SESSION_SECRET) return process.env.STUDENT_SESSION_SECRET;
  const pins = `${process.env.JEROME_STUDENT_PIN ?? ""}:${process.env.KAMERON_STUDENT_PIN ?? ""}:${process.env.MARILYN_STUDENT_PIN ?? ""}`;
  return pins !== "::"
    ? crypto.createHash("sha256").update(`weems-rosenduft-academy:${pins}`).digest("hex")
    : undefined;
}

export function hasStudentSession(value: string | undefined, expectedStudent: StudentKey) {
  const secret = sessionSecret();
  if (!value || !secret) return false;
  const [student, expires, signature] = value.split(".");
  if (student !== expectedStudent || !expires || !signature || Number(expires) < Date.now()) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${student}.${expires}`).digest("hex");
  return safeEqual(signature, expected);
}
