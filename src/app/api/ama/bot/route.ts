import { NextRequest } from "next/server";

const PLACEHOLDER_ANSWER = "real vivian-ish mode is still booting up — ask again soon. 🍵";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const content = typeof body?.content === "string" ? body.content.trim() : "";

  if (!content) {
    return Response.json(
      { ok: false, error: "Question content is required." },
      { status: 400 },
    );
  }

  return Response.json({
    ok: true,
    answerSource: "placeholder",
    botAnswer: PLACEHOLDER_ANSWER,
  });
}
