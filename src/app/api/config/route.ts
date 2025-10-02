import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const configPath = path.join(process.cwd(), "src/config/config.json");

// GET -> load config.json
export async function GET() {
  try {
    const file = await fs.readFile(configPath, "utf-8");
    const config = JSON.parse(file);
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load config" },
      { status: 500 }
    );
  }
}

// POST -> save config.json
export async function POST(req: Request) {
  try {
    const body = await req.json();
    await fs.writeFile(configPath, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save config" },
      { status: 500 }
    );
  }
}
