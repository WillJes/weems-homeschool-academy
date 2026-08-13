const message =
  "Private school records remain safely in the original Academy site while the Vercel database is connected.";

function pendingMigration() {
  return Response.json({ error: message, records: [] }, { status: 503 });
}

export const GET = pendingMigration;
export const POST = pendingMigration;
export const PATCH = pendingMigration;
