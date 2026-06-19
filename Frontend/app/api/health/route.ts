import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "payflex-bnpl",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
  });
}
