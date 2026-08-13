export async function POST() {
  return Response.json(
    {
      error:
        "Portfolio uploads remain safely in the original Academy site while Vercel storage is connected.",
    },
    { status: 503 },
  );
}
