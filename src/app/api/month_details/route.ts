export async function GET(request: Request) {
  try {
    const res = await fetch("https://api.notion.com/v1/pages/", {
      method: "GET",
      headers: {
        "Notion-Version": "2022-06-28",
        Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      return Response.json({ error: text }, { status: res.status });
    }

    const data = await res.json();

    // ✅ Correctly reference `data`
    const monthName =
      data.properties?.Name?.title?.[0]?.plain_text ?? "Unknown";

    return Response.json({ monthName });
  } catch (err: unknown) {
    // make sure error serializes properly
    const errorMessage =
      err instanceof Error ? err.message : JSON.stringify(err);

    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
