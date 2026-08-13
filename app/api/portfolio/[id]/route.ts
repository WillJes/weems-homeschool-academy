export async function GET() {
  return Response.json(
    {
      error:
        "Portfolio files remain safely in the original Academy site while Vercel storage is connected.",
    },
    { status: 503 },
  );
}
