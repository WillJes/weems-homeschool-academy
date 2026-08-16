import {neon} from "@neondatabase/serverless";
import {getChatGPTUser} from "../../chatgpt-auth";
import {isAdministrator} from "../../access-control";

export const dynamic="force-dynamic";

type RecordInput={id?:number;kind?:string;student?:string;recordDate?:string;subject?:string;title?:string;detail?:string;value?:string;status?:string};
let schemaReady:Promise<unknown>|null=null;

function database(){
  const url=process.env.DATABASE_URL??process.env.POSTGRES_URL??process.env.NEON_DATABASE_URL;
  if(!url)throw new Error("DATABASE_URL is not configured");
  return neon(url);
}

async function ensureSchema(){
  if(!schemaReady){
    const sql=database();
    schemaReady=sql`
      CREATE TABLE IF NOT EXISTS academy_records (
        id BIGSERIAL PRIMARY KEY,
        kind TEXT NOT NULL,
        student TEXT NOT NULL,
        record_date DATE NOT NULL,
        subject TEXT NOT NULL DEFAULT '',
        title TEXT NOT NULL,
        detail TEXT NOT NULL DEFAULT '',
        value TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT 'recorded',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `.catch(error=>{schemaReady=null;throw error});
  }
  await schemaReady;
}

async function requireAdministrator(){
  const user=await getChatGPTUser();
  return user&&isAdministrator(user.email)?user:null;
}

function clean(value:unknown,max=2000){return String(value??"").trim().slice(0,max)}

function databaseError(error:unknown){
  console.error("[academy-records] Database request failed",error);
  const setup=error instanceof Error&&error.message.includes("DATABASE_URL");
  return Response.json({error:setup?"The Academy database connection is still finishing setup. Redeploy after Vercel adds DATABASE_URL.":"The private records database could not be reached. Please try again."},{status:setup?503:500});
}

export async function GET(){
  if(!await requireAdministrator())return Response.json({error:"Administrator access required"},{status:403});
  try{
    await ensureSchema();
    const sql=database();
    const records=await sql`
      SELECT id,kind,student,record_date::text AS "recordDate",subject,title,detail,value,status,created_at::text AS "createdAt"
      FROM academy_records ORDER BY record_date DESC,created_at DESC LIMIT 1000
    `;
    return Response.json({records});
  }catch(error){return databaseError(error)}
}

export async function POST(request:Request){
  const user=await requireAdministrator();
  if(!user)return Response.json({error:"Administrator access required"},{status:403});
  try{
    const input=await request.json() as RecordInput;
    const kind=clean(input.kind,40),student=clean(input.student,80),recordDate=clean(input.recordDate,10),title=clean(input.title,300);
    if(!kind||!student||!/^\d{4}-\d{2}-\d{2}$/.test(recordDate)||!title)return Response.json({error:"Kind, student, date and title are required."},{status:400});
    const subject=clean(input.subject,120),detail=clean(input.detail),value=clean(input.value,300),status=clean(input.status,40)||"recorded";
    await ensureSchema();
    const sql=database();
    const [record]=await sql`
      INSERT INTO academy_records (kind,student,record_date,subject,title,detail,value,status)
      VALUES (${kind},${student},${recordDate},${subject},${title},${detail},${value},${status})
      RETURNING id,kind,student,record_date::text AS "recordDate",subject,title,detail,value,status,created_at::text AS "createdAt"
    `;
    return Response.json({record,recordedBy:user.email},{status:201});
  }catch(error){return databaseError(error)}
}

export async function PATCH(request:Request){
  if(!await requireAdministrator())return Response.json({error:"Administrator access required"},{status:403});
  try{
    const input=await request.json() as RecordInput;
    const id=Number(input.id),status=clean(input.status,40);
    if(!Number.isSafeInteger(id)||id<1||!status)return Response.json({error:"A valid record and status are required."},{status:400});
    await ensureSchema();
    const sql=database();
    const [record]=await sql`UPDATE academy_records SET status=${status},updated_at=NOW() WHERE id=${id} RETURNING id,status`;
    if(!record)return Response.json({error:"Record not found"},{status:404});
    return Response.json({record});
  }catch(error){return databaseError(error)}
}
