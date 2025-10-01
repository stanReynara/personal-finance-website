export async function GET(request: Request) {
  try {
    // Fetch all expenses
    const res = await fetch(
      `https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID_3}/query`,
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

    // For each expense, fetch the month name if it has a relation
    const enhancedItems = await Promise.all(
      items.map(async (item: any) => {
        const monthRelationId = item.properties.Month?.relation?.[0]?.id;
        if (monthRelationId) {
          const monthRes = await fetch(
            `https://api.notion.com/v1/pages/${monthRelationId}`,
            {
              method: "GET",
              headers: {
                "Notion-Version": "2022-06-28",
                Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
              },
            }
          );

          if (monthRes.ok) {
            const monthPage = await monthRes.json();
            item.properties.MonthName =
              monthPage.properties.Name?.title?.[0]?.plain_text ?? "-";
          } else {
            item.properties.MonthName = "-";
          }
        } else {
          item.properties.MonthName = "-";
        }

        return item;
      })
    );

    // Sort by date ascending
    enhancedItems.sort((a, b) => {
      const dateA = a.properties.Date?.date?.start
        ? new Date(a.properties.Date.date.start).getTime()
        : 0;
      const dateB = b.properties.Date?.date?.start
        ? new Date(b.properties.Date.date.start).getTime()
        : 0;
      return dateA - dateB;
    });

    return Response.json(enhancedItems);
  } catch (err: unknown) {
    return Response.json({ error: err as Error }, { status: 500 });
  }
}
