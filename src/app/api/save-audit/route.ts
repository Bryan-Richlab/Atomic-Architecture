import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const notionDatabaseId = process.env.NOTION_DATABASE_ID || "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, funnelSteps, microSteps, gouletId, monthlyCA, hourlyRate } = body;

    const goulet = funnelSteps.find((s: any) => s.id === gouletId);
    const totalHoursCEO = funnelSteps
      .filter((s: any) => s.who === "moi")
      .reduce((sum: number, s: any) => sum + s.hoursPerWeek, 0);

    const page = await notion.pages.create({
      parent: { database_id: notionDatabaseId },
      properties: {
        Email: {
          title: [
            {
              text: {
                content: email,
              },
            },
          ],
        },
        "CA Mensuel": {
          number: monthlyCA || 0,
        },
        "Taux Horaire": {
          number: hourlyRate || 0,
        },
        "Heures CEO/sem": {
          number: totalHoursCEO,
        },
        "Goulet": {
          select: {
            name: goulet?.name || "Non identifié",
          },
        },
        Statut: {
          select: {
            name: "Nouveau",
          },
        },
      },
      children: [
        {
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [{ type: "text", text: { content: "Funnel" } }],
          },
        },
        ...funnelSteps.map((step: any, index: number) => ({
          object: "block" as const,
          type: "bulleted_list_item" as const,
          bulleted_list_item: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: `${index + 1}. ${step.name} (${step.who}, ${step.hoursPerWeek}h/sem)`,
                },
              },
            ],
          },
        })),
        {
          object: "block" as const,
          type: "heading_2" as const,
          heading_2: {
            rich_text: [{ type: "text", text: { content: "Décomposition du Goulet" } }],
          },
        },
        ...microSteps
          .filter((m: any) => m.name)
          .flatMap((micro: any) => [
            {
              object: "block" as const,
              type: "bulleted_list_item" as const,
              bulleted_list_item: {
                rich_text: [
                  {
                    type: "text",
                    text: { content: `**${micro.name}**` },
                    annotations: { bold: true },
                  },
                ],
              },
            },
            ...micro.atoms
              .filter((a: string) => a.trim())
              .map((atom: string, i: number) => ({
                object: "block" as const,
                type: "bulleted_list_item" as const,
                bulleted_list_item: {
                  rich_text: [
                    {
                      type: "text",
                      text: { content: `  ${i + 1}. ${atom}` },
                    },
                  ],
                },
              })),
          ]),
      ],
    });

    return NextResponse.json({ success: true, pageId: page.id });
  } catch (error) {
    console.error("Notion API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save to Notion" },
      { status: 500 }
    );
  }
}
