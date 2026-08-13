export const ADMIN_EMAIL="weemsjestina@gmail.com";
export const APPROVED_INSTRUCTORS=[
 "denisegordon55@gmail.com",
 "damora1528@gmail.com",
 "trnging@gmail.com"
];
export const normalizeEmail=(email:string)=>email.trim().toLowerCase();
export const isAdministrator=(email:string)=>normalizeEmail(email)===ADMIN_EMAIL;
export const isApprovedInstructor=(email:string)=>isAdministrator(email)||APPROVED_INSTRUCTORS.includes(normalizeEmail(email));
export const studentForEmail=(email:string)=>{
 const normalized=normalizeEmail(email);
 if(isAdministrator(normalized))return "administrator";
 if(process.env.JEROME_STUDENT_EMAIL&&normalized===normalizeEmail(process.env.JEROME_STUDENT_EMAIL))return "jerome";
 if(process.env.KAMERON_STUDENT_EMAIL&&normalized===normalizeEmail(process.env.KAMERON_STUDENT_EMAIL))return "kameron";
 return null;
};
