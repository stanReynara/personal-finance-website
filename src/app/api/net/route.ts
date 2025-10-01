export async function GET(request: Request) {
  try {
    const res = await fetch(
      `https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID_1}/query`,
      {
        method: "POST",
        headers: {
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
        },
        body: JSON.stringify({
          page_size: 10,
        }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return Response.json({ error: text }, { status: res.status });
    }

    const data = await res.json();

    const items = data.results;
    console.log(items);

    return Response.json(items);
  } catch (err: unknown) {
    return Response.json({ error: err as Error }, { status: 500 });
  }
}
